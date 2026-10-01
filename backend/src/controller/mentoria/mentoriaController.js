import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import { claimImage } from '../../helper/imageStorage';
// eslint-disable-next-line import/named
import { importUser } from '../user/userController';
import transporter from '../../configs/email/email';
import getNextDateTime from '../../helper/getNextDateTimeHelper';
import * as mentorias from '../../repositories/mentoriaRepository';
import * as users from '../../repositories/userRepository';

function checkSameHour(days, hours) {
  let check = false;
  days.forEach((element, index) =>
    days.forEach((search, indexSearch) => {
      if (index !== indexSearch) {
        if (element === search) {
          if (hours[index] === hours[indexSearch]) {
            check = true;
          }
        }
      }
    })
  );
  return check;
}

async function getMentoringById(id) {
  const result = await mentorias.findById(id);
  return result ? result.data : null;
}

async function getMentoriaByMentoringId(id) {
  try {
    const m = await mentorias.findById(id);
    return m && m.data.flagDisable === false ? m.data : [];
  } catch (e) {
    return null;
  }
}

// todo usuario que pode ser mentor (userType diferente de 2)
async function getMentores() {
  const mentorDocs = await users.listMentors();

  return mentorDocs.map((res) => ({
    cpf: res.data.cpf,
    name: res.data.name,
    image: res.data.image,
    email: res.data.email,
  }));
}

async function getMentorByCPF(cpf) {
  const res = await users.findByCpf(cpf);

  if (!res) return undefined;

  return {
    cpf: res.data.cpf,
    name: res.data.name,
    image: res.data.image,
    email: res.data.email,
  };
}

async function triggerEmail(userEmail, datas) {
  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        partialsDir: './src/configs/email/views/',
        defaultLayout: 'email',
        layoutsDir: './src/configs/email/views/layouts',
        extName: '.handlebars',
      },
      viewPath: path.resolve('./src/configs/email/views/layouts'),
      extName: '.handlebars',
    })
  );
  const emailConfiguration = {
    to: userEmail,
    subject: 'Mentoria agendada.',
    template: 'email',
    attachments: [
      {
        filename: 'logo_cabecalho.png',
        // relativo ao diretorio de execucao, como as views acima: dentro do
        // bundle da Lambda o __dirname nao aponta mais para src/
        path: path.resolve('./src/configs/email/logo_cabecalho.png'),
        cid: 'logo',
      },
    ],
    context: {
      mentor: datas.mentor,
      mentorando: datas.mentorando,
      mentoria: datas.mentoria,
      data: datas.data,
      hora: datas.hora,
      descricao: datas.descMentoria,
      tipoMentoria: datas.tipoMentoria,
    },
  };

  transporter.sendMail(emailConfiguration, (err) => {
    return !err;
  });
}

module.exports = {
  async insert(request, response) {
    try {
      const {
        title,
        description,
        knowledgeArea,
        mentoringOption = [],
        dayOfWeek = [],
        time = [],
      } = request.body;

      const signalFlag = false;

      // claim check: so o ticket chega aqui, a imagem ja esta no bucket
      const image = await claimImage(request.body.imageKey);

      const cpfSession = request.tokenCpf;

      // controls the number of weeks to be scheduled

      const dates = [];
      let days = [];
      let hours = [];

      if (!Array.isArray(dayOfWeek)) {
        days.push(dayOfWeek);
        hours.push(time);
      } else {
        if (checkSameHour(dayOfWeek, time)) {
          return response
            .status(400)
            .json({ error: 'Foram selecionado dias e horários iguais!' });
        }

        days = dayOfWeek;
        hours = time;
      }

      const date = await getNextDateTime(dates, days, hours);

      await mentorias.insert({
        image,
        cpf: cpfSession,
        title,
        description,
        knowledgeArea,
        mentoringOption,
        flagDisable: signalFlag,
        isVisible: true,
        dateTime: date,
        mentoringApproved: false,
      });

      return response.status(200).send({ success: true });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao inserir mentoria : ${e}`,
      });
    }
  },

  async getMentoringBySession(request, response) {
    try {
      const results = await mentorias.listWhere({
        cpf: request.tokenCpf,
        flagDisable: false,
      });

      if (!results.length) {
        return response
          .status(400)
          .json({ error: 'Não tem mentorias para serem listados' });
      }
      return response.status(200).json(results);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de mentorias. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async getMentoring(request, response) {
    try {
      const { id } = request.params;
      const m = await mentorias.findById(id);

      if (!m) {
        return response
          .status(400)
          .json({ error: 'Não foi encontrado essa mentoria' });
      }

      const result = m.data;
      result.id = id;
      result.mentorInfos = await getMentorByCPF(result.cpf);

      return response.status(200).json(result);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de mentoria. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async getApproved(request, response) {
    try {
      const mentorInfos = await getMentores();

      const mentoringDocs = await mentorias.listWhere({
        flagDisable: false,
        isVisible: true,
        mentoringApproved: true,
      });

      const results = mentoringDocs.map((doc) => {
        const mentorInfo = mentorInfos.find(
          (mentor) => mentor.cpf === doc.data.cpf
        );

        return {
          idMentoria: doc.id,
          cpf: doc.data.cpf,
          title: doc.data.title,
          flagDisable: doc.data.flagDisable,
          description: doc.data.description,
          mentoringOption: doc.data.mentoringOption,
          dateTime: doc.data.dateTime,
          knowledgeArea: doc.data.knowledgeArea,
          image: doc.data.image,
          mentorInfos: mentorInfo
            ? { image: mentorInfo.image, name: mentorInfo.name }
            : {},
        };
      });

      if (!results.length) {
        return response
          .status(400)
          .json({ error: 'Não tem mentorias para serem listadas' });
      }

      return response.status(200).json(results);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de mentorias. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async getPending(request, response) {
    try {
      // mesmo criterio do getAll de usuarios: o userType assinado no token.
      // Buscar pelo cpf falhava para admin sem cpf (criado por create-admin).
      if (parseInt(request.tokenUserType, 10) !== 0) {
        return response.status(401).send('Unauthorized');
      }

      const mentorInfos = await getMentores();

      const mentoringDocs = await mentorias.listWhere({
        flagDisable: false,
        mentoringApproved: false,
      });

      const results = mentoringDocs.map((doc) => {
        const mentorInfo = {
          name: 'Não encontrado',
          image: '',
          email: '',
        };
        const found = mentorInfos.find((mentor) => mentor.cpf === doc.data.cpf);
        if (found) {
          mentorInfo.name = found.name;
          mentorInfo.image = found.image;
          mentorInfo.email = found.email;
        }
        return {
          id: doc.id,
          data: doc.data,
          mentorInfo,
        };
      });
      return response.status(200).json(results);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de mentorias. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async updateMentoring(request, response) {
    try {
      const allDatas = request.body;
      const { id } = request.params;
      const mentoring = await getMentoringById(id);

      if (!mentoring) {
        return response
          .status(404)
          .send({ error: 'A mentoria não foi encontrada' });
      }

      Object.keys(allDatas).forEach((el) => {
        if (allDatas[el] === null || allDatas[el] === undefined)
          delete allDatas[el];
      });

      if (allDatas.imageKey) {
        allDatas.image = await claimImage(allDatas.imageKey);
      } else if (!allDatas.image) {
        delete allDatas.image;
      }
      delete allDatas.imageKey;

      const { dayOfWeek, time } = allDatas;

      // so recalcula as datas quando o body traz os horarios; sem eles o
      // codigo antigo gravava dateTime a partir de [undefined]
      if (dayOfWeek !== undefined && time !== undefined) {
        const dates = [];
        let days = [];
        let hours = [];

        if (!Array.isArray(dayOfWeek)) {
          days.push(dayOfWeek);
          hours.push(time);
        } else {
          if (checkSameHour(dayOfWeek, time)) {
            return response
              .status(400)
              .json({ error: 'Foram selecionado dias e horários iguais!' });
          }
          days = dayOfWeek;
          hours = time;
        }

        allDatas.dateTime = await getNextDateTime(dates, days, hours);
      }

      await mentorias.update(id, allDatas);

      return response.status(200).send({
        success: true,
        msg: 'Mentoria atualizada com sucesso',
        data: allDatas,
      });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao atualizar mentoria : ${e}`,
      });
    }
  },

  // eslint-disable-next-line consistent-return
  async mentoringEvaluation(request, response) {
    try {
      const { title, approved, mentorEmail } = request.body;
      const { id } = request.params;

      const flagDisable = !approved;

      await mentorias.update(id, {
        title,
        mentoringApproved: approved,
        flagDisable,
      });

      const res = await getMentoringById(id);

      if (flagDisable) {
        const email = {
          from: process.env.EMAIL_ACCOUNT,
          to: mentorEmail,
          subject: `Mentoria não Aprovada`,
          text: `Sua mentoria de título "${title}" não foi aprovada.\nEntre em contato com o administrador para mais detalhes.`,
        };

        transporter.sendMail(email, (error) => {
          if (error) {
            res.emailStatus = `erro ao enviar email: ${error}`;
            return response.status(200).send(res);
          }
          res.emailStatus = 'email enviado com sucesso';
          return response.status(200).send(res);
        });
      } else {
        return response.status(200).send(res);
      }
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao atualizar mentoria : ${e}`,
      });
    }
  },

  async deactivateMentoring(request, response) {
    try {
      const { id } = request.params;
      const mentoring = await getMentoringById(id);
      if (!mentoring) {
        return response
          .status(404)
          .send({ error: 'A mentoria não foi encontrada' });
      }

      await mentorias.update(id, { flagDisable: true });

      return response
        .status(200)
        .send({ success: true, msg: 'Mentoria desativada' });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao desativar mentoria : ${e}`,
      });
    }
  },

  async changeVisibility(request, response) {
    try {
      const { id } = request.query;
      const mentoring = await getMentoringById(id);
      if (!mentoring)
        return response.status(404).json({
          error: `Mentoria não encontrada.`,
        });

      if (Object.prototype.hasOwnProperty.call(mentoring, 'isVisible'))
        mentoring.isVisible = !mentoring.isVisible;
      else mentoring.isVisible = false;

      await mentorias.update(id, { isVisible: mentoring.isVisible });
      let finalMessage = 'Mentoria esta invisível';
      if (mentoring.isVisible) finalMessage = 'Mentoria esta visível';
      return response.status(200).send({ success: true, msg: finalMessage });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao trocar visibilidade de mentoria : ${e}`,
      });
    }
  },

  async choiceMentoring(request, response) {
    try {
      const { typeMentoring, descProject, date, hour } = request.body;

      let isAvailable = false;
      const mentoradoId = request.tokenCpf;
      const { id } = request.params;

      const mentoring = await getMentoriaByMentoringId(id);

      // mentoria inexistente ou desativada: indisponivel, e nao erro 500
      if (!mentoring || !Array.isArray(mentoring.dateTime)) {
        return response.status(400).send({
          success: false,
          msg: 'Mentoria indisponível',
        });
      }

      for (let x = 0; x < mentoring.dateTime.length; x += 1) {
        if (
          mentoring.dateTime[x].dayOfTheMonth === date &&
          mentoring.dateTime[x].times[0].hour === hour
        ) {
          if (mentoring.dateTime[x].times[0].flagBusy === false) {
            mentoring.dateTime[x].times[0].typeMentoring = typeMentoring;
            mentoring.dateTime[x].times[0].descProject = descProject;
            mentoring.dateTime[x].times[0].flagBusy = true;
            mentoring.dateTime[x].times[0].mentoradoId = mentoradoId;
            isAvailable = true;
            break;
          }
        }
      }

      if (isAvailable) {
        await mentorias.update(id, mentoring);
        const mentor = (await importUser(mentoring.cpf)).data;
        const mentorando = (await importUser(mentoradoId)).data;
        const hora = hour.substring(0, 5);
        const datas = {
          mentor: mentor.name,
          mentorando: mentorando.name,
          mentoria: mentoring.title,
          data: date,
          hora,
          descMentoria: descProject,
          tipoMentoria: typeMentoring,
        };
        await triggerEmail(mentor.email, datas);

        return response.status(200).send({
          success: true,
          msg: 'Inscrição efetuada',
        });
      }
      return response.status(400).send({
        success: false,
        msg: 'Mentoria indisponível',
      });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao realizar inscrição : ${e}`,
      });
    }
  },
};
