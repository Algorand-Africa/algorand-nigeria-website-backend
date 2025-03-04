/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');
import { DataSource } from 'typeorm';
import entities from './libs/typeorm';

dotenv.config({ path: path.join(__dirname, '.env') });

const { env } = process;

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST as any,
  port: env.DB_PORT as any,
  username: env.DB_USERNAME as any,
  password: env.DB_PASSWORD as any,
  database: env.DB_NAME as any,
  entities,
  migrations: [`migrations/*{.ts,.js}`],
});
