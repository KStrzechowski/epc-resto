export const getInsertQuery = async <T extends Record<string, any>>(
  tableName: string,
  object: T,
) => {
  const keys = Object.keys(object) as (keyof T)[];
  const values = keys.map((key) => object[key]);

  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

  const query = `
      INSERT INTO ${tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *;
    `;

  return { query, values };
};
