import knex from 'knex';
import config from './index';

export const db = knex(config.database);
