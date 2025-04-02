import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { entities } from '../dal/entities';
const dotenv_path = path.resolve(process.cwd(), '.env');
dotenv.config({ path: dotenv_path });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Object.values(entities),
  migrations: [path.join(__dirname, './../dal/migrations/*.ts')],
  logging: process.env.TYPEORM_LOGGING as LoggerOptions,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
