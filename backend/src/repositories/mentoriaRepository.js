import { query } from '../configs/database/connection';
import { rowToDoc, buildSet, buildInsert } from './mapper';

const COLUMNS = {
  cpf: 'cpf',
  image: 'image',
  title: 'title',
  description: 'description',
  knowledgeArea: 'knowledge_area',
  mentoringOption: 'mentoring_option',
  flagDisable: 'flag_disable',
  isVisible: 'is_visible',
  dateTime: 'date_time',
  mentoringApproved: 'mentoring_approved',
};

const JSON_COLUMNS = ['mentoring_option', 'date_time'];

const toDoc = (row) => rowToDoc(row, COLUMNS);

export const findById = async (id) => {
  try {
    const { rows } = await query('SELECT * FROM mentorias WHERE id = $1', [
      id,
    ]);
    return rows[0] ? toDoc(rows[0]) : null;
  } catch (err) {
    if (err.code === '22P02') return null; // id que nao e uuid
    throw err;
  }
};

// Equivalente aos .where(campo, '==', valor) encadeados do Firestore.
// Ex.: listWhere({ flagDisable: false, mentoringApproved: true })
export const listWhere = async (filters = {}) => {
  const conditions = [];
  const values = [];
  Object.entries(filters).forEach(([field, value]) => {
    const column = COLUMNS[field];
    if (!column) throw new Error(`filtro desconhecido: ${field}`);
    values.push(value);
    conditions.push(`${column} = $${values.length}`);
  });
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT * FROM mentorias ${where} ORDER BY created_at`,
    values
  );
  return rows.map(toDoc);
};

export const insert = async (doc) => {
  const { cols, placeholders, values } = buildInsert(doc, COLUMNS, JSON_COLUMNS);
  const { rows } = await query(
    `INSERT INTO mentorias (${cols.join(', ')}) VALUES (${placeholders.join(
      ', '
    )}) RETURNING id`,
    values
  );
  return rows[0].id;
};

export const update = async (id, partial) => {
  const { sets, values } = buildSet(partial, COLUMNS, JSON_COLUMNS);
  if (sets.length === 0) return;
  values.push(id);
  await query(
    `UPDATE mentorias SET ${sets.join(', ')} WHERE id = $${values.length}`,
    values
  );
};
