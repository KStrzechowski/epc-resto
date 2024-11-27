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
  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
  });

  pgm.createTable('meals', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true, unique: true },
    category_id: {
      type: 'int',
      notNull: true,
      references: 'categories',
      onDelete: 'cascade',
    },
    price: { type: 'decimal(10,2)', notNull: true },
  });

  pgm.createType('order_status', [
    'new',
    'in_the_kitchen',
    'in_delivery',
    'done',
  ]);

  pgm.createTable('orders', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      default: pgm.func('gen_random_uuid()'),
    },
    status: { type: 'order_status', notNull: true, default: 'new' },
    total_price: { type: 'numeric(10,2)', notNull: true },
  });

  pgm.createTable('order_items', {
    id: 'id',
    order_id: {
      type: 'uuid',
      notNull: true,
      references: 'orders',
      onDelete: 'cascade',
    },
    meal_id: {
      type: 'int',
      notNull: true,
      references: 'meals',
      onDelete: 'cascade',
    },
    quantity: { type: 'int', notNull: true, default: 1 },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  pgm.dropTable('order_items');
  pgm.dropTable('orders');
  pgm.dropTable('meals');
  pgm.dropTable('categories');
  pgm.dropType('order_status');
};
