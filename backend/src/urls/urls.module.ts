import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urls } from 'src/db/entities/urls.entity';
import { Url_ip } from 'src/db/entities/url_ip.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Urls, Url_ip])],
  controllers: [UrlsController],
  providers: [UrlsService]
})
export class UrlsModule {}
