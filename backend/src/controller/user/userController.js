import bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { claimImage } from '../../helper/imageStorage';
import jwtAuth from '../../configs/jwt/auth';
import transporter from '../../configs/email/email';
import * as users from '../../repositories/userRepository';

const userType = {
  ADMIN: 0,
  MENTHOR: 1,
  MENTEE: 2,
  BOTH: 3,
};

async function getUser(email) {
  const user = await users.findByEmail(email);
  if (!user) {
    return null;
  }
  return user;
}

// Auxiliary create functions

// Adds menthor data to an existing user of type mentee
async function addMenthorData(newData, response) {
  try {
    const { linkedin, areas, userId } = newData;

    const partial = { userType: userType.BOTH };

    if (linkedin) {
      partial.linkedin = linkedin;
    }
    if (areas) {
      partial.areas = areas;
    }

    await users.update(userId, partial);

    return response
      .status(200)
      .send({ success: true, msg: 'Usuário atualizado com sucesso' });
  } catch (e) {
    return response.status(500).json({
      error: `Erro ao atualizar usuário : ${e}`,
    });
  }
}

// Inserting new menthor
async function newMenthor(request, response) {
  try {
    const { cpf, email, password, name, linkedin, phone, areas } = request.body;

    // claim check: so o ticket chega aqui, a imagem ja esta no bucket
    const image = await claimImage(request.body.imageKey);

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await getUser(email);

    if (!yup.string().email().isValidSync(email)) {
      return response.status(400).send({ error: 'E-mail fora do formanto' });
    }

    if (user) {
      // User already exists

      // Checks type of user to update it or not
      if (
        user.data.userType === userType.MENTHOR ||
        user.data.userType === userType.BOTH
      ) {
        return response.status(400).send({ error: 'Usuário já existe.' });
      }

      const newData = {
        linkedin,
        areas,
        userId: user.id,
      };

      // User exists but it's type is different
      return addMenthorData(newData, response);
    }

    const currentUserType = userType.MENTHOR;

    await users.insert({
      password: passwordHash,
      name,
      cpf,
      phone,
      linkedin,
      email,
      image,
      areas,
      userType: currentUserType,
    });

    return response.status(200).send({ success: true });
  } catch (e) {
    return response.status(500).json({
      error: `Erro ao inserir usuário : ${e}`,
    });
  }
}

// Adds mentee data to an existing user of type menthor
async function addMenteeData(newData, response) {
  try {
    const { birthDate, registration, userId } = newData;

    const partial = { userType: userType.BOTH };

    if (birthDate) {
      partial.birthDate = birthDate;
    }
    if (registration) {
      partial.registration = registration;
    }

    await users.update(userId, partial);

    return response
      .status(200)
      .send({ success: true, msg: 'Usuário atualizado com sucesso' });
  } catch (e) {
    return response.status(500).json({
      error: `Erro ao atualizar usuário : ${e}`,
    });
  }
}

// Inserting new Mentee
async function newtMentee(request, response) {
  try {
    const {
      name,
      birthDate,
      cpf,
      phone,
      registration,
      email,
      password,
    } = request.body;

    // claim check: so o ticket chega aqui, a imagem ja esta no bucket
    const image = await claimImage(request.body.imageKey);

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await getUser(email);

    if (user) {
      // User already exists

      if (
        user.data.userType === userType.MENTEE ||
        user.data.userType === userType.BOTH
      ) {
        return response.status(400).send({ error: 'Usuário já existe.' });
      }

      const newData = {
        birthDate,
        registration,
        userId: user.id,
      };

      // User exists but it's type is different
      return addMenteeData(newData, response);
    }

    const currentUserType = userType.MENTEE;

    await users.insert({
      name,
      birthDate,
      cpf,
      phone,
      registration,
      email,
      password: passwordHash,
      image,
      userType: currentUserType,
    });

    return response.status(200).send({ success: true });
  } catch (e) {
    return response.status(500).json({
      error: `Erro ao inserir usuário : ${e}`,
    });
  }
}

// Exported functions
module.exports = {
  async get(request, response) {
    try {
      const user = await getUser(request.tokenEmail);
      if (!user) {
        return response.status(400).json({ error: 'Nenhum usuário' });
      }
      delete user.data.password;
      return response.status(200).json(user.data);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de usuários. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  async getAll(request, response) {
    try {
      if (parseInt(request.tokenUserType, 10) === userType.ADMIN) {
        const allUsers = await users.list();
        // o hash da senha nao sai do servidor
        allUsers.forEach((user) => {
          delete user.data.password;
        });
        return response.status(200).json(allUsers);
      }
      return response.status(405).json({
        error: `Não é possível realizar essa operação para esse usuário`,
      });
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de busca de usuários. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  // eslint-disable-next-line consistent-return
  async insert(request, response) {
    try {
      const userTypeRequest = parseInt(request.body.userType, 10);

      if (userTypeRequest === userType.MENTHOR) {
        await newMenthor(request, response);
      } else if (userTypeRequest === userType.MENTEE) {
        await newtMentee(request, response);
      } else {
        return response.status(400).send({
          message: 'Flag precisa ser passada',
        });
      }
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao inserir usuário : ${e}`,
      });
    }
  },

  async update(request, response) {
    try {
      const allDatas = request.body;
      const idToken = request.tokenId;

      Object.keys(allDatas).forEach((el) => {
        if (allDatas[el] === null || allDatas[el] === undefined)
          delete allDatas[el];
      });

      if (allDatas.email) {
        if (!yup.string().email().isValidSync(allDatas.email)) {
          return response
            .status(400)
            .send({ error: 'E-mail fora do formato.' });
        }
      }
      if (allDatas.imageKey) {
        allDatas.image = await claimImage(allDatas.imageKey);
      }
      delete allDatas.imageKey;

      // senha so muda se vier preenchida, e sempre com hash (o formulario de
      // edicao manda o campo vazio quando o usuario nao a altera)
      if (typeof allDatas.password === 'string' && allDatas.password.length > 0) {
        allDatas.password = await bcrypt.hash(allDatas.password, 8);
      } else {
        delete allDatas.password;
      }

      // userType 0 e administrador: nao pode ser atribuido pelo proprio usuario
      if (allDatas.userType !== undefined) {
        const parsedUserType = parseInt(allDatas.userType, 10);
        if (
          parsedUserType === userType.MENTHOR ||
          parsedUserType === userType.MENTEE ||
          parsedUserType === userType.BOTH
        ) {
          allDatas.userType = parsedUserType;
        } else {
          delete allDatas.userType;
        }
      }

      const user = await users.findById(idToken);

      if (!user) {
        return response.status(400).send({ error: 'Usuário não existe.' });
      }

      await users.update(user.id, allDatas);

      return response.status(200).json({
        token: {
          expiresIn: jwtAuth.expiresIn,
        },
      });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao atualizar usuário : ${e}`,
      });
    }
  },

  async updateMentee(request, response) {
    try {
      const {
        name,
        birthDate,
        cpf,
        phone,
        email,
        registration,
        password,
      } = request.body;

      const image = await claimImage(request.body.imageKey);

      const user = await getUser(email);
      if (!user) {
        return response.status(400).send({ error: 'Usuário não existe' });
      }

      const partial = {};
      if (name) partial.name = name;
      if (birthDate) partial.birthDate = birthDate;
      if (cpf) partial.cpf = cpf;
      if (phone) partial.phone = phone;
      if (registration) partial.registration = registration;
      if (password) partial.password = await bcrypt.hash(password, 8);
      if (image) partial.image = image;

      await users.update(user.id, partial);

      return response
        .status(200)
        .send({ success: true, msg: 'Usuário atualizado com sucesso' });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao atualizar usuário : ${e}`,
      });
    }
  },

  async delete(request, response) {
    try {
      const { email } = request.body;

      if (!email) {
        return response
          .status(400)
          .send({ error: 'Variável email dever ser passada ' });
      }

      const user = await getUser(email);
      if (!user) {
        return response.status(400).send({ error: 'Usuário não existe.' });
      }

      await users.remove(user.id);
      return response
        .status(200)
        .send({ success: true, msg: `${email} removido com sucesso!` });
    } catch (e) {
      return response.status(500).json({
        error: `Erro ao deletar usuário: ${e}`,
      });
    }
  },

  async importUser(cpf) {
    return users.findByCpf(cpf);
  },

  async getUserCredentials(userID) {
    const user = await users.findByCpf(userID);
    if (!user) {
      return undefined;
    }
    return user.data.userType;
  },

  // eslint-disable-next-line consistent-return
  async sendVerificationEmail(request, response) {
    try {
      const { email } = request.body;

      const url = process.env.ROOT_URL || 'localhost:8080';

      const user = await getUser(email);

      if (!user) {
        return response
          .status(404)
          .send(`não foi encontrado um usuário com o email ${email}`);
      }

      const passwordRequirementExpiration = new Date();

      passwordRequirementExpiration.setDate(
        passwordRequirementExpiration.getDate() + 1
      );

      await users.update(user.id, {
        passwordRequirementExpiration,
      });

      const emailSettings = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: `Recuperação de senha`,
        text: `Você solicitou uma nova senha. Clique no link abaixo para defini-la:\nhttp://${url}/nova-senha/${user.id}`,
      };

      transporter.sendMail(emailSettings, (error) => {
        if (error) {
          return response.status(400).send(`erro ao enviar email: ${error}`);
        }
        return response
          .status(200)
          .send(`email enviado com sucesso para ${email}`);
      });
    } catch (e) {
      response.status(500).send(`erro ao processar requisição: ${e}`);
    }
  },

  async updatePassword(request, response) {
    try {
      const { id, newPassword } = request.body;

      const user = await users.findById(id);

      if (!user) {
        return response
          .status(404)
          .send({ message: 'usuário não encontrado' });
      }

      const expiration = user.data.passwordRequirementExpiration;

      if (!expiration || new Date(expiration) <= new Date()) {
        return response.status(401).send({
          message: 'Solicitação de troca de senha inválida',
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 8);

      await users.update(id, {
        password: passwordHash,
        passwordRequirementExpiration: null,
      });

      return response
        .status(202)
        .send({ success: true, msg: 'Senha atualizada com sucesso' });
    } catch (e) {
      return response
        .status(500)
        .send({ error: `erro ao processar a requisição. ${e}` });
    }
  },
};
