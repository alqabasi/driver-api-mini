import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('driver_id').unsigned().references('id').inTable('drivers');
    table.decimal('amount', 10, 2).notNullable();
    table.string('type').notNullable(); // 'income' or 'expense'
    table.string('description');
    table.string('category');
    table.string('payment_method');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
