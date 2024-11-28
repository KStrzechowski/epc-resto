/**
 * Function creates query for inserting multiple values into PostgreSQL table.
 * This helper works only for objects with the same fields.
 * @param tableName Name of the PostgreSQL table.
 * @param objects Objects to be inserted.
 * @returns Query for inserting multiple values into the selected table.
 */
export const getInsertManyQuery = async <T extends Record<string, any>>(
  tableName: string,
  objects: T[],
) => {
  const keys = Object.keys(objects[0]) as (keyof T)[];
  const values = objects.flatMap((obj) => keys.map((key) => obj[key]));

  const placeholders = objects
    .map(
      (_, rowIndex) =>
        `(${keys
          .map((_, colIndex) => `$${rowIndex * keys.length + colIndex + 1}`)
          .join(', ')})`,
    )
    .join(', ');

  const query = `
      INSERT INTO ${tableName} (${keys.join(', ')})
      VALUES ${placeholders}
      RETURNING *;
    `;

  return { query, values };
};
