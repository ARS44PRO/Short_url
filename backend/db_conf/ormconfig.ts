import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(process.cwd(), 'dist/src/db/entities/*.{ts,js}')],
  migrations: [path.join(process.cwd(),'dist/src/db/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true
});

export default dataSource;