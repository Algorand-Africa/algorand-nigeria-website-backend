import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),
  APP_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().positive().default(8081),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),
  ADMIN_JWT_SECRET: z.string(),
  ADMIN_JWT_EXPIRY: z.string(),
  DB_PORT: z.coerce.number().positive().default(5432),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  ALGOD_TOKEN: z.string(),
  ALGOD_SERVER: z.string(),
  ALGOD_PORT: z.coerce.number().positive().default(443),
  TYPEORM_ENTITIES_DIR: z.string(),
  TYPEORM_MIGRATIONS_DIR: z.string(),
  TYPEORM_LOGGING: z.coerce.boolean().optional(),
  SEND_GRID_API_KEY: z.string(),
  PINATA_JWT_URL: z.string(),
  PINATA_JWT: z.string(),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export const parseEnv = (data: Record<string, unknown>) =>
  envConfigSchema.parse(data);

export const loadEnv = (data: Record<string, unknown>) => parseEnv(data);
