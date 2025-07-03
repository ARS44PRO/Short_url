import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url_ip } from 'src/db/entities/url_ip.entity';
import { Urls } from 'src/db/entities/urls.entity';
import { Repository } from 'typeorm';
import {nanoid} from 'nanoid';
import { CreateUrlDto } from './urls.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Urls)
    private urlRep: Repository<Urls>,
    @InjectRepository(Url_ip)
    private ipRep: Repository<Url_ip> 
  ){}  

  async create_short(body: CreateUrlDto){

    const exist_url = await this.urlRep.existsBy({originalUrl: body.originalUrl});
  
    if (!exist_url) {
      if (body.alias){
        const exist_alias = await this.urlRep.existsBy({shortUrl:body.alias})
        if (!exist_alias){
          await this.urlRep.insert({
            originalUrl: body.originalUrl,
            expiresAt: body.expiresAt,
            alias: body.alias,
            shortUrl: body.alias
          });

          return {
            message: 'Ссылка успешно создана',
            link: body.alias
          };
        }
      } else {
          let sh_url: string;
          do {
            sh_url = nanoid(5);
          } while (await this.urlRep.existsBy({shortUrl: sh_url}));
          await this.urlRep.insert({
            originalUrl: body.originalUrl,
            expiresAt: body.expiresAt,
            shortUrl: sh_url
          });
          return {
            message: 'Ссылка успешно создана',
            link: sh_url
          }
      }
    } else {
      const link = await this.urlRep.findOneBy({originalUrl:body.originalUrl})
      return {
        message: 'Ваша ссылка уже создана',
        link: link?.shortUrl
      }
    }
  }

  async redir(ip:string, url: string){
    if (await this.urlRep.existsBy({shortUrl:url})){
      const red = await this.urlRep.findOneBy({shortUrl:url});

      await this.ipRep.insert({
        ip: ip,
        shortUrl: url
      });
      await this.urlRep.update({shortUrl:url}, {clickCount:()=>'clickCount + 1'});
      
      return red?.originalUrl
    } else {
      throw new NotFoundException('Такой ссылки нету');
    }
  }

  async info(url: string){
    if (await this.urlRep.existsBy({shortUrl:url})){
      const obj = await this.urlRep.findOneBy({shortUrl:url})
      return {
        originalUrl: obj?.originalUrl,
        createdAt: obj?.createdAt,
        clickCount: obj?.clickCount
      }
    } else {
      throw new NotFoundException('Такой ссылки нету');
    }
  }

  async del(url: string){
    if (await this.urlRep.existsBy({shortUrl:url})){
      await this.urlRep.delete({shortUrl:url});
    } else {
      throw new NotFoundException('Такой ссылки нету')
    }
  }

  async analyt(url:string){
    if (await this.urlRep.existsBy({shortUrl:url})){
    const ips = await this.ipRep
      .createQueryBuilder('url_ip')
      .select('url_ip.ip', 'ip')
      .where(`url_ip.shortUrl = :url`, { url })
      .groupBy('url_ip.ip')
      .orderBy('MAX(url_ip.click_date)', 'DESC')
      .limit(5)
      .getRawMany();
    const count = await this.urlRep.findOneBy({shortUrl:url});
      return {
        ip: ips.map((i)=>i.ip),
        clickCount: count?.clickCount
      }
    } else {
      throw new NotFoundException('Такой ссылки нету');
    }  
  }
}
