import { Router } from 'express';

import userController from './controller/user/userController';
import knowledgeAreasController from './controller/knowledgeAreas/knowledgeAreasController';
import sessionController from './controller/session/sessionController';
import mentoriaController from './controller/mentoria/mentoriaController';
import uploadController from './controller/upload/uploadController';

import authMiddleware from './middlewares/auth';
import upload from './configs/multer/multer';

const routes = new Router();

/*
    Routes de upload (claim check)
    A imagem vai DIRETO para o bucket com um ticket assinado; a API so recebe a
    chave (imageKey). Por isso os formularios usam upload.none(): mandar arquivo
    no corpo da API agora e erro.
 */
routes.post('/uploads', uploadController.createTicket);
// Sem bucket (desenvolvimento) o front manda o arquivo para a propria API
if (!process.env.FILES_BUCKET) {
  routes.post('/uploads/local', upload.single('file'), uploadController.receiveLocal);
}

/*
   Routes of autoconhecimento
 */
routes.get('/areasDisponiveis', knowledgeAreasController.get);
routes.get(
  '/areaConhecimento',
  authMiddleware,
  knowledgeAreasController.getValid
);
routes.post(
  '/areaConhecimento',
  authMiddleware,
  knowledgeAreasController.insert
);
routes.put(
  '/areaConhecimento',
  authMiddleware,
  knowledgeAreasController.update
);
routes.delete(
  '/areaConhecimento',
  authMiddleware,
  knowledgeAreasController.delete
);

routes.post(
  '/areaConhecimento/integrate',
  knowledgeAreasController.integrateUserArea
);
routes.post(
  '/areaConhecimento/deintegrate',
  knowledgeAreasController.deintegrateUserArea
);

/*
    Routes of users
 */
routes.get('/users', authMiddleware, userController.get);
routes.get('/allUsers', authMiddleware, userController.getAll);

routes.post('/users', upload.none(), userController.insert);
routes.post('/passwordRecuperationLink', userController.sendVerificationEmail);
routes.post('/setPassword/', userController.updatePassword);
routes.put(
  '/users',
  upload.none(),
  authMiddleware,
  userController.update
);
routes.delete('/users', authMiddleware, userController.delete);

/*
    Routes from sessions
 */
routes.post('/login', sessionController.login);

/*
Routes from mentoria
*/
routes.post(
  '/cadastroMentoria',
  upload.none(),
  authMiddleware,
  mentoriaController.insert
);
routes.get('/mentoriaAll', authMiddleware, mentoriaController.getApproved);
routes.get(
  '/mentoriaSession',
  authMiddleware,
  mentoriaController.getMentoringBySession
);

routes.get(
  '/mentoria/:id',
  authMiddleware,
  mentoriaController.getMentoring
);

routes.get('/pendingMentorings', authMiddleware, mentoriaController.getPending);

routes.put(
  '/mentoria/alter/:id',
  upload.none(),
  authMiddleware,
  mentoriaController.updateMentoring
);

routes.put(
  '/mentoria/evaluate/:id',
  authMiddleware,
  mentoriaController.mentoringEvaluation
);

routes.put(
  '/mentoria/changeVisibility/',
  authMiddleware,
  mentoriaController.changeVisibility
);

routes.delete(
  '/mentoria/deactivate/:id',
  authMiddleware,
  mentoriaController.deactivateMentoring
);
routes.put(
  '/mentoria/choice/:id',
  authMiddleware,
  mentoriaController.choiceMentoring
);
export default routes;
