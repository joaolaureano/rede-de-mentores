import { client } from './http';

// Claim check: pega um ticket em POST /uploads, manda a imagem direto para o
// bucket e devolve a chave para o formulario enviar como `imageKey`. A imagem
// nunca passa pela API.
export async function uploadImage(file) {
  if (!(file instanceof File)) return null;

  const { data: ticket } = await client.post('/uploads');

  const form = new FormData();
  Object.entries(ticket.fields).forEach(([field, value]) => {
    form.append(field, value);
  });
  // O arquivo precisa ser o ULTIMO campo do multipart (exigencia do POST do S3)
  form.append('file', file);

  const url = ticket.url.startsWith('/')
    ? client.defaults.baseURL + ticket.url
    : ticket.url;

  // fetch e nao axios: o client manda Content-Type/CORS que quebrariam o POST no S3
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Falha ao enviar imagem');

  return ticket.key;
}

export default uploadImage;
