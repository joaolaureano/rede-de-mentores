import { timingSafeEqual } from 'crypto';
import serverlessHttp from 'serverless-http';
import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';

// Nada que leia segredo do ambiente pode ser importado no topo: configs/jwt/auth
// captura JWT_KEY no import. O app entra por require, depois que o SSM respondeu.

const SECRETS = ['DB_URL', 'JWT_KEY', 'ORIGIN_SECRET'];
// Opcionais: credenciais do Gmail (so existem com o e-mail ligado) e a URL do
// site, usada no link de recuperacao de senha. A ROOT_URL fica no SSM, e nao
// no ambiente, porque o CloudFront depende desta funcao: o Terraform nao
// consegue passar o dominio dele para ca sem criar um ciclo.
const OPTIONAL = ['EMAIL_ACCOUNT', 'EMAIL_PASSWORD', 'ROOT_URL'];

// Os segredos vem do Parameter Store, e nao de variavel de ambiente: variavel
// de ambiente e legivel para quem consiga descrever a funcao.
const loadSecrets = async () => {
  const prefix = process.env.SSM_PREFIX;
  if (!prefix) throw new Error('SSM_PREFIX nao configurado');

  const { Parameters = [] } = await new SSMClient({}).send(
    new GetParametersCommand({
      Names: [...SECRETS, ...OPTIONAL].map((name) => `${prefix}/${name}`),
      WithDecryption: true,
    })
  );

  const byName = new Map(Parameters.map((p) => [p.Name, p.Value]));
  SECRETS.forEach((name) => {
    const value = byName.get(`${prefix}/${name}`);
    // falhar no cold start e melhor que descobrir no primeiro login
    if (!value) throw new Error(`${prefix}/${name} vazio ou ilegivel`);
    process.env[name] = value;
  });
  OPTIONAL.forEach((name) => {
    const value = byName.get(`${prefix}/${name}`);
    if (value) process.env[name] = value;
  });
};

let ready = null;
let handle = null;

const init = () => {
  if (!ready) {
    ready = loadSecrets()
      .then(() => {
        // eslint-disable-next-line global-require
        const app = require('./app').default;
        // multipart (upload de imagem) chega em base64 pela Function URL
        handle = serverlessHttp(app, { binary: ['image/*', 'multipart/form-data'] });
      })
      .catch((err) => {
        // sem isso um cold start que falha envenena o container: toda
        // invocacao seguinte herdaria a promise rejeitada
        ready = null;
        throw err;
      });
  }
  return ready;
};

// A Function URL e publica: so o CloudFront injeta este header, entao quem
// chega sem ele nao veio por onde deveria.
const cameFromCloudFront = (event) => {
  const expected = process.env.ORIGIN_SECRET;
  const received = (event.headers || {})['x-origin-secret'] || '';
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
};

export const handler = async (event, context) => {
  await init();

  if (!cameFromCloudFront(event)) {
    return {
      statusCode: 403,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  return handle(event, context);
};
