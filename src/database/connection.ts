import knex from 'knex';
import config from '../config';

const db = knex(config.database);

export default db;
