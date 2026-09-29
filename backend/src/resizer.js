import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { KEY_REGEX, resizedName, resizeBuffer } from './helper/imageStorage';

const s3 = new S3Client({});

// Trigger: S3 ObjectCreated em uploads/. Gera files/<uuid>-resized.jpg, que e
// exatamente o nome que a API grava no banco ao validar o ticket. Qualquer erro
// sobe (a invocacao assincrona do S3 tenta de novo).
export const handler = async (event) => {
  const records = (event && event.Records) || [];

  // eslint-disable-next-line no-restricted-syntax
  for (const record of records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    if (!KEY_REGEX.test(key)) {
      console.log(`chave fora do padrao de upload, ignorada: ${key}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const original = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    );
    // eslint-disable-next-line no-await-in-loop
    const body = Buffer.from(await original.Body.transformToByteArray());
    // eslint-disable-next-line no-await-in-loop
    const resized = await resizeBuffer(body);

    // eslint-disable-next-line no-await-in-loop
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `files/${resizedName(key)}`,
        Body: resized,
        ContentType: 'image/jpeg',
        // nome unico por upload: pode ficar em cache para sempre
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    // O original NAO e apagado: a regra de lifecycle do bucket expira uploads/
    // depois de 1 dia. Mantendo o arquivo, um claim nunca perde a corrida com o
    // resize (o HeadObject sempre encontra a chave).
  }
};
