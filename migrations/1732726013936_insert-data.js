/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  const result = await pgm.db.query(`
        INSERT INTO categories (name) 
        VALUES 
          ('ramen'),
          ('sushi')
        RETURNING id, name;
      `);

  const ramenId = result.rows.find((row) => row.name === 'ramen').id;
  const sushiId = result.rows.find((row) => row.name === 'sushi').id;

  // Insert data into meals
  pgm.sql(`
        INSERT INTO meals (name, category_id, price) 
        VALUES 
          ('Spicy Miso Tonkotsu Ramen', ${ramenId}, 9.99),
          ('Shoyu Ramen with Grilled Chicken', ${ramenId}, 13),
          ('Chirashi Sushi', ${sushiId}, 25.50),
          ('Uni and Toro Sushi', ${sushiId}, 30);
      `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.sql(`
        DELETE FROM categories 
        WHERE name IN ('ramen', 'sushi');
      `);
};
