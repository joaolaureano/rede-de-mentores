import { client as Http } from './http';


export const mentoriasByMentorado = (headers) => Http.get('/mentoriaAll', headers);
