import { client as Http } from './http';

export const desativarMentoria = (headers) => Http.delete(`/mentoria/deactivate/${headers.params.id}`, headers);
export const atualizarMentoria = (headers, data) => Http.put(`/mentoria/alter/${headers.headers.param.id}`, data, headers);
export const marcarMentoria = (headers, data) => Http.put(`/mentoria/choice/${data.idMentoria}`, data.choice, headers);
export const mentoriasByMentor = (headers) => Http.get('/mentoriaSession', headers);
export const cadastrarMentoria = (headers, data) => Http.post('/cadastroMentoria', data, headers);
export const mudarVisibilidade = (headers) => Http.put('/mentoria/changeVisibility/', null, headers);
export const buscarMentoria = (headers) => Http.get(`/mentoria/${headers.headers.id}`, headers);