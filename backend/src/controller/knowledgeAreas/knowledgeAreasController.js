import * as areas from '../../repositories/areaRepository';
import * as mentorias from '../../repositories/mentoriaRepository';
import * as users from '../../repositories/userRepository';

require('dotenv').config();

async function getAllMentoring() {
  const results = await mentorias.listWhere({
    mentoringApproved: true,
    flagDisable: false,
    isVisible: true,
  });
  return results.map((mentoria) => mentoria.data);
}

async function filterValidKnowledgeAreas(knowledgAreas) {
  const filteredResult = [];
  const allMentorings = await getAllMentoring();
  for (let i = 0; i < knowledgAreas.length; i += 1) {
    for (let j = 0; j < allMentorings.length; j += 1) {
      if (knowledgAreas[i].name === allMentorings[j].knowledgeArea) {
        filteredResult.push(knowledgAreas[i]);
        break;
      }
    }
  }
  return filteredResult;
}

async function getAll() {
  const result = await areas.list();
  return result.map((area) => area.data);
}

module.exports = {
  async get(request, response) {
    try {
      const result = await getAll();
      if (!result) {
        return response.status(404).json({ error: 'Não foi encontrado.' });
      }
      return response.status(200).send(result);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async getValid(request, response) {
    try {
      let result = await getAll();
      result = await filterValidKnowledgeAreas(result);
      if (!result) {
        return response.status(404).json({ error: 'Não foi encontrado.' });
      }
      return response.status(200).send(result);
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },

  async insert(request, response) {
    try {
      const { name } = request.body;

      const existing = await areas.findByName(name);
      if (existing) {
        return response
          .status(400)
          .send({ error: 'Área de conhecimento já existe.' });
      }

      await areas.insert(name);
      return response.status(201).send();
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processo de cadastro de Área de conhecimento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  async update(request, response) {
    try {
      const { name, newName } = request.body;

      const area = await areas.findByName(name);
      if (!area) {
        return response
          .status(400)
          .send({ error: 'Área de conhecimento não existe.' });
      }
      await areas.rename(area.id, newName);
      return response.status(200).send();
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de atualização da área de conhecimento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  async delete(request, response) {
    try {
      const { name } = request.body;

      const area = await areas.findByName(name);
      if (!area) {
        return response.status(400).send({ error: 'Usuário não existe.' });
      }

      await areas.remove(area.id);
      return response.status(200).send();
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de deleção da área de conhecimento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  // `user` e o CPF do usuario: o codigo antigo consultava um campo `user` que
  // nao existia na colecao, e a rota nunca encontrava ninguem
  async integrateUserArea(request, response) {
    try {
      const { name, user } = request.body;
      if (!name || !user) {
        return response
          .status(404)
          .json({ error: 'Não foi encontrado esse usuário' });
      }
      const listAreas = new Set();
      const area = await areas.findByName(name);
      const userDoc = await users.findByCpf(user);
      if (userDoc && userDoc.data.areas) {
        userDoc.data.areas.forEach((areaName) => listAreas.add(areaName));
      }
      if (!area) {
        return response
          .status(404)
          .json({ error: 'Não foi encontrado essa área de conhecimento' });
      }
      if (!userDoc) {
        return response
          .status(404)
          .json({ error: 'Não foi encontrado esse usuário' });
      }
      listAreas.add(area.data.name);
      await users.update(userDoc.id, { areas: Array.from(listAreas) });
      return response.status(200).send();
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de integração entre usuário e área de conhecimento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
  async deintegrateUserArea(request, response) {
    try {
      const { name, user } = request.body;
      if (!name || !user) {
        return response
          .status(404)
          .json({ error: 'Não foi encontrado esse usuário' });
      }
      const userDoc = await users.findByCpf(user);
      if (!userDoc) {
        return response
          .status(404)
          .json({ error: 'Não foi encontrado esse usuário' });
      }
      const listAreas = userDoc.data.areas;
      if (!listAreas) {
        return response.status(404).json({
          error:
            'Não foi encontrado esse as áreas de conhecimento desse usuário',
        });
      }
      if (!listAreas.includes(name)) {
        return response.status(404).json({
          error: 'Não foi encontrado essa área de conhecimento nesse usuário',
        });
      }
      await users.update(userDoc.id, {
        areas: listAreas.filter((value) => value !== name),
      });
      return response.status(200).send();
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento de separação entre user e área de conhecimento. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
};
