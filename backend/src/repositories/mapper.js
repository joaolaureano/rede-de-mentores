// Traduz entre as linhas do Postgres (snake_case) e os documentos que o codigo
// usava no Firestore (camelCase). Os controllers e o frontend continuam vendo
// exatamente os nomes de campo de antes.

// Campo nulo sai do documento: no Firestore campo nunca gravado nao existia,
// e as respostas ao frontend nao ganham chaves novas com null.
export const rowToDoc = (row, columns) => {
  const data = {};
  Object.entries(columns).forEach(([field, column]) => {
    const value = row[column];
    if (value !== null && value !== undefined) data[field] = value;
  });
  return { id: row.id, data };
};

// Monta "SET col = $n" so com os campos conhecidos. Chave desconhecida e
// ignorada: o update do Firestore aceitava qualquer campo vindo do body, aqui
// isso nao vira coluna nem SQL.
export const buildSet = (partial, columns, jsonColumns = []) => {
  const sets = [];
  const values = [];
  Object.entries(partial).forEach(([field, value]) => {
    const column = columns[field];
    if (!column || value === undefined) return;
    values.push(jsonColumns.includes(column) ? JSON.stringify(value) : value);
    sets.push(`${column} = $${values.length}`);
  });
  return { sets, values };
};

export const buildInsert = (doc, columns, jsonColumns = []) => {
  const cols = [];
  const values = [];
  Object.entries(doc).forEach(([field, value]) => {
    const column = columns[field];
    if (!column || value === undefined) return;
    cols.push(column);
    values.push(jsonColumns.includes(column) ? JSON.stringify(value) : value);
  });
  const placeholders = values.map((_, i) => `$${i + 1}`);
  return { cols, placeholders, values };
};
