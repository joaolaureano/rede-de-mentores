import { client as Http } from './http';

export const allAreas = (headers) => Http.get('/areaConhecimento', headers);

export const availableAreas = () => Http.get('/areasDisponiveis');
