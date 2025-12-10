import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Drop tables in order of dependency
  await knex.schema.dropTableIfExists('locations');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('users'); // Drop users table if it exists
  await knex.schema.dropTableIfExists('drivers'); // Drop old drivers table

  // Create the new unified 'users' table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('fullName').notNullable();
    table.string('mobilePhone').unique().notNullable();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo('driver');
    table.boolean('isActive').notNullable().defaultTo(false);
    table.string('license_number').unique();
    table.timestamps(true, true);
  });

  // Re-create the 'locations' table with a foreign key to 'users'
  await knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('latitude', 9, 6).notNullable();
    table.decimal('longitude', 9, 6).notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });

  // Re-create the 'transactions' table with a foreign key to 'users'
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('type').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop all tables in reverse order of creation
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('locations');
  await knex.schema.dropTableIfExists('users');

  // Re-create the old 'drivers' table if needed for rollback
  await knex.schema.createTable('drivers', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('license_number').unique().notNullable();
  });
}
