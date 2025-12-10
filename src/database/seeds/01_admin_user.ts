import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').where('role', 'admin').del();

  const password = 'admin_password'; // TODO: Change this in a secure way
  const hashedPassword = await bcrypt.hash(password, 10);

  // Inserts seed entries
  await knex('users').insert([
    {
      fullName: 'Admin User',
      mobilePhone: '0000000000', // TODO: Change this to a real phone number
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      license_number: 'N/A',
    },
  ]);
}
