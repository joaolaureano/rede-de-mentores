import { query } from '../configs/database/connection';

// colecao `area_conhecimento`: documentos { name }
const toDoc = (row) => ({ id: row.id, data: { name: row.name } });

export const list = async () => {
  const { rows } = await query(
    'SELECT id, name FROM areas_conhecimento ORDER BY name'
  );
  return rows.map(toDoc);
};

export const findByName = async (name) => {
  const { rows } = await query(
    'SELECT id, name FROM areas_conhecimento WHERE name = $1',
    [name]
  );
  return rows[0] ? toDoc(rows[0]) : null;
};

export const insert = async (name) => {
  const { rows } = await query(
    'INSERT INTO areas_conhecimento (name) VALUES ($1) RETURNING id',
    [name]
  );
  return rows[0].id;
};

export const rename = async (id, name) => {
  await query('UPDATE areas_conhecimento SET name = $1 WHERE id = $2', [
    name,
    id,
  ]);
};

export const remove = async (id) => {
  await query('DELETE FROM areas_conhecimento WHERE id = $1', [id]);
};
