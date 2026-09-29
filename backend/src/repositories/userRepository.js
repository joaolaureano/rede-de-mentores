import { query } from '../configs/database/connection';
import { rowToDoc, buildSet, buildInsert } from './mapper';

// campo do documento (nome do Firestore) -> coluna
const COLUMNS = {
  email: 'email',
  password: 'password',
  name: 'name',
  cpf: 'cpf',
  phone: 'phone',
  linkedin: 'linkedin',
  image: 'image',
  areas: 'areas',
  userType: 'user_type',
  birthDate: 'birth_date',
  registration: 'registration',
  passwordRequirementExpiration: 'password_requirement_expiration',
};

const toDoc = (row) => rowToDoc(row, COLUMNS);

// No Firestore `areas` aceitava qualquer coisa; aqui e text[]. Um valor solto
// vindo de multipart (string em vez de lista) vira lista de um item.
const normalize = (doc) =>
  doc.areas === undefined || Array.isArray(doc.areas)
    ? doc
    : { ...doc, areas: [String(doc.areas)] };

const first = async (sql, params) => {
  const { rows } = await query(sql, params);
  return rows[0] ? toDoc(rows[0]) : null;
};

export const findById = (id) =>
  first('SELECT * FROM users WHERE id = $1', [id]).catch((err) => {
    // id que nao e uuid valido (link adulterado, id antigo do Firestore) e so
    // "nao encontrado", nao erro de servidor
    if (err.code === '22P02') return null;
    throw err;
  });

export const findByEmail = (email) =>
  first('SELECT * FROM users WHERE email = $1', [email]);

export const findByCpf = (cpf) =>
  first(
    'SELECT * FROM users WHERE cpf = $1 ORDER BY created_at DESC LIMIT 1',
    [cpf]
  );

export const list = async () => {
  const { rows } = await query('SELECT * FROM users ORDER BY created_at');
  return rows.map(toDoc);
};

// Quem pode ser mentor: todo userType diferente de 2 (MENTORADO). E o que o
// codigo antigo fazia com as duas consultas "< 2" e "> 2".
export const listMentors = async () => {
  const { rows } = await query(
    'SELECT * FROM users WHERE user_type <> 2 ORDER BY created_at'
  );
  return rows.map(toDoc);
};

export const insert = async (doc) => {
  const { cols, placeholders, values } = buildInsert(normalize(doc), COLUMNS);
  const { rows } = await query(
    `INSERT INTO users (${cols.join(', ')}) VALUES (${placeholders.join(
      ', '
    )}) RETURNING id`,
    values
  );
  return rows[0].id;
};

export const update = async (id, partial) => {
  const { sets, values } = buildSet(normalize(partial), COLUMNS);
  if (sets.length === 0) return;
  values.push(id);
  await query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${values.length}`,
    values
  );
};

export const remove = async (id) => {
  await query('DELETE FROM users WHERE id = $1', [id]);
};
