import { DataSource } from "typeorm";
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [path.join(__dirname, "./entities/*.{ts,js}")],
  migrations: [path.join(__dirname, "./migrations/*.{ts,js}")],
  synchronize: false,
  logging: true
});

export default dataSource;