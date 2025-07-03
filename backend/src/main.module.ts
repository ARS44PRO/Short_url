import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { UrlsModule } from './urls/urls.module';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [path.join(__dirname, "db/entities/*.{ts,js}")],
      migrations: [path.join(__dirname, "db/migrations/*.{ts,js}")],
      synchronize: false
      
    }),
    UrlsModule
  ]
})
export class AppModule {}
