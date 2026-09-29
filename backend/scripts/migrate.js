// Aplica db/schema.sql no banco de DB_URL (idempotente).
// Uso: DB_URL=postgresql://... npm run migrate
import fs from 'fs';
import path from 'path';
import { query } from '../src/configs/database/connection';

const sql = fs.readFileSync(path.resolve(__dirname, '..', 'db', 'schema.sql'), 'utf8');

query(sql)
  .then(() => {
    console.log('schema aplicado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('falha ao aplicar schema:', err.message);
    process.exit(1);
  });
