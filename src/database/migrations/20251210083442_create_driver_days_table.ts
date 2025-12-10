import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('driver_days', (table) => {
    table.increments('id').primary();
    table.integer('driver_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.enum('status', ['open', 'closed']).defaultTo('open');
    table.timestamp('opened_at').defaultTo(knex.fn.now());
    table.timestamp('closed_at');
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('driver_days');
}
