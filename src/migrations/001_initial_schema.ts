
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("fullName").notNullable();
      table.string("shortName").notNullable();
      table.string("mobile").unique().notNullable();
      table.string("password_hash").notNullable();
      table.enum("role", ["admin", "viewer", "driver"]).notNullable();
      table.boolean("active").defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable("driver_days", (table) => {
      table.uuid("id").primary();
      table.uuid("driver_id").references("id").inTable("users").onDelete("CASCADE");
      table.date("date").notNullable();
      table.enum("status", ["open", "closed"]).notNullable();
      table.timestamp("opened_at").notNullable();
      table.timestamp("closed_at");
    })
    .createTable("statements", (table) => {
      table.uuid("id").primary();
      table.uuid("day_id").references("id").inTable("driver_days").onDelete("CASCADE");
      table.uuid("driver_id").references("id").inTable("users").onDelete("CASCADE");
      table.enum("type", ["income", "expense"]).notNullable();
      table.string("client_name");
      table.decimal("amount").notNullable();
      table.string("details");
      table.string("media_url");
      table.string("voice_url");
      table.timestamps(true, true);
      table.timestamp("deleted_at");
    })
    .createTable("admin_charges", (table) => {
      table.uuid("id").primary();
      table.uuid("driver_id").references("id").inTable("users").onDelete("CASCADE");
      table.decimal("amount").notNullable();
      table.enum("status", ["pending", "accepted", "denied"]).notNullable();
      table.timestamps(true, true);
      table.timestamp("accepted_at");
    })
    .createTable("locations", (table) => {
      table.uuid("id").primary();
      table.uuid("driver_id").references("id").inTable("users").onDelete("CASCADE");
      table.decimal("lat").notNullable();
      table.decimal("lng").notNullable();
      table.timestamp("timestamp").notNullable();
    })
    .createTable("audit_logs", (table) => {
      table.uuid("id").primary();
      table.uuid("user_id").references("id").inTable("users");
      table.string("action_type").notNullable();
      table.string("entity_type").notNullable();
      table.uuid("entity_id");
      table.json("payload_json");
      table.timestamps(true, true);
    })
    .createTable("refresh_tokens", (table) => {
      table.uuid("id").primary();
      table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
      table.string("token").notNullable();
      table.timestamp("expires_at").notNullable();
      table.timestamps(true, true);
      table.boolean("revoked").defaultTo(false);
    })
    .createTable("permissions", (table) => {
      table.increments("id").primary();
      table.string("name").unique().notNullable();
      table.string("description");
    })
    .createTable("role_permissions", (table) => {
      table.increments("id").primary();
      table.string("role").notNullable();
      table.integer("permission_id").unsigned().references("id").inTable("permissions");
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("role_permissions")
    .dropTableIfExists("permissions")
    .dropTableIfExists("refresh_tokens")
    .dropTableIfExists("audit_logs")
    .dropTableIfExists("locations")
    .dropTableIfExists("admin_charges")
    .dropTableIfExists("statements")
    .dropTableIfExists("driver_days")
    .dropTableIfExists("users");
}