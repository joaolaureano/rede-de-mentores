import { Pool } from 'pg';

require('dotenv').config();

// Criado na primeira consulta, e nao no import: na Lambda o DB_URL so chega do
// SSM depois que o modulo ja foi carregado.
let pool = null;

const getPool = () => {
  if (!pool) {
    if (!process.env.DB_URL) throw new Error('DB_URL nao configurado');

    pool = new Pool({
      connectionString: process.env.DB_URL,
      // Uma Lambda atende uma requisicao por vez: poucas conexoes bastam, e o
      // Neon fecha as ociosas - melhor soltar antes que ele derrube.
      max: 3,
      idleTimeoutMillis: 30000,
    });

    // Conexao ociosa derrubada pelo outro lado vira erro no pool; sem este
    // listener o processo cai.
    pool.on('error', (err) => console.error('pg pool error', err.message));
  }
  return pool;
};

export const query = (text, params) => getPool().query(text, params);

export default { query };
