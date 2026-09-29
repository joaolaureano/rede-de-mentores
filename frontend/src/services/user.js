import { client as Http } from './http';

export const login = (data) => Http.post('/login', data);
export const getAll = (data) => Http.get('/allUsers', data);
export const cadastrarUsuario = (data) => Http.post('/users', data);
export const esqueceuSenha = (data) => Http.post('/passwordRecuperationLink', data);
export const resetarSenha = (data) => Http.post('/setPassword', data);
export const editarUsuario = (data, headers) => Http.put('/users', data, headers);
export const profile = (headers) => Http.get('/users', headers);
