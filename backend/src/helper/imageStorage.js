import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

// Claim check: a imagem nunca passa pela API. O cliente pega um ticket
// (createUploadTicket), envia o arquivo direto ao bucket em uploads/, e manda
// so a chave (imageKey) no formulario. A API confere o ticket (claimImage) e
// grava o nome final; a Lambda de resize, disparada pelo ObjectCreated,
// produz files/<uuid>-resized.jpg de forma assincrona.

// O cliente S3 e criado na primeira utilizacao: em desenvolvimento (sem
// FILES_BUCKET) nenhuma chamada a AWS e feita.
let s3 = null;

function getS3() {
  if (!s3) s3 = new S3Client({});
  return s3;
}

const ASSETS = path.resolve(__dirname, '..', '..', 'assets');

// A chave do original e o ticket que o front devolve no formulario (imageKey)
export const KEY_REGEX = /^uploads\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jpg$/;

export function newUploadKey() {
  return `uploads/${uuidv4()}.jpg`;
}

// <uuid>-resized.jpg: e o nome gravado no banco (campo `image`) e o nome que a
// Lambda de resize grava em files/. Valida a chave antes de derivar o nome.
export function resizedName(key) {
  const match = KEY_REGEX.exec(key || '');
  if (!match) throw new Error('imagem invalida');
  return `${match[1]}-resized.jpg`;
}

export function resizeBuffer(buffer) {
  return sharp(buffer)
    .rotate() // respeita a orientacao EXIF das fotos de celular
    .resize(500)
    .jpeg({ quality: 70 })
    .toBuffer();
}

// Ticket para o front enviar a imagem DIRETO ao bucket. Em desenvolvimento cai
// na propria API (/uploads/local).
export async function createUploadTicket() {
  const key = newUploadKey();

  if (process.env.FILES_BUCKET) {
    const { url, fields } = await createPresignedPost(getS3(), {
      Bucket: process.env.FILES_BUCKET,
      Key: key,
      Fields: { 'Content-Type': 'image/jpeg' },
      Conditions: [
        ['content-length-range', 1, 4 * 1024 * 1024],
        ['eq', '$Content-Type', 'image/jpeg'],
      ],
      Expires: 300, // 5 minutos
    });
    return { url, fields, key };
  }

  return {
    url: '/uploads/local',
    fields: { key, 'Content-Type': 'image/jpeg' },
    key,
  };
}

// Chamado no submit do formulario: confere que a imagem existe de fato antes de
// gravar o nome no banco. Devolve o nome final (<uuid>-resized.jpg).
export async function claimImage(key) {
  if (!key) return undefined;

  const name = resizedName(key); // lanca se a chave nao for valida

  if (process.env.FILES_BUCKET) {
    try {
      await getS3().send(
        new HeadObjectCommand({ Bucket: process.env.FILES_BUCKET, Key: key })
      );
    } catch (e) {
      if (
        e.name === 'NotFound' ||
        (e.$metadata && e.$metadata.httpStatusCode === 404)
      ) {
        throw new Error('imagem nao encontrada');
      }
      throw e;
    }
    return name;
  }

  if (!fs.existsSync(path.join(ASSETS, key))) {
    throw new Error('imagem nao encontrada');
  }
  return name;
}

// Apenas desenvolvimento: simula o evento do S3 gravando o original em
// assets/uploads e o resultado do resize em assets/userImages.
export async function saveLocalUpload(key, buffer) {
  const name = resizedName(key); // valida a chave
  const uploadsDir = path.join(ASSETS, 'uploads');
  const userImagesDir = path.join(ASSETS, 'userImages');

  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(userImagesDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, path.basename(key)), buffer);
  fs.writeFileSync(path.join(userImagesDir, name), await resizeBuffer(buffer));
}

// Usado pelo seed: sobe o arquivo pelo mesmo caminho do upload real (na nuvem
// o resize fica a cargo da Lambda, disparada pelo ObjectCreated)
export async function putUpload(key, buffer) {
  if (process.env.FILES_BUCKET) {
    await getS3().send(
      new PutObjectCommand({
        Bucket: process.env.FILES_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      })
    );
    return;
  }
  await saveLocalUpload(key, buffer);
}
