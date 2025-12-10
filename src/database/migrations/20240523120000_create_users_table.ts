import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("fullName").notNullable();
    table.string("shortName").notNullable();
    table.string("mobile").unique().notNullable();
    table.string("password_hash").notNullable();
    table.enu("role", ["admin", "viewer", "driver"]).notNullable();
    table.boolean("active").defaultTo(true);
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
