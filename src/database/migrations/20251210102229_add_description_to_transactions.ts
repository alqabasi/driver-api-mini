import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('transactions', function (table) {
    table.string('description');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('transactions', function (table) {
    table.dropColumn('description');
  });
}
