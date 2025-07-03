import { Body, Controller, Delete, Get, Ip, Param, Post, Redirect, Res } from '@nestjs/common';
import { CreateUrlDto } from './urls.dto';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController {
  constructor(private service: UrlsService){}

  @Post('shorten')
  async create_sh_url(@Body() create_url: CreateUrlDto){
    return await this.service.create_short(create_url);
  }

  @Get(':shortUrl')
  @Redirect()
  async redir(
    @Param('shortUrl') shortUrl: string,
    @Ip() ip: string
  ){
    return { 
      url: await this.service.redir(ip, shortUrl)
    }
  }

  @Get('info/:shortUrl')
  async find(
    @Param('shortUrl') url: string
  ){
    return await this.service.info(url);
  }

  @Delete('delete/:shortUrl')
  async del(
    @Param('shortUrl') url: string
  ){
    return await this.service.del(url);
  }

  @Get('analytics/:url')
  async analyt(
    @Param('url') url: string
  ){
    return this.service.analyt(url);
  }
}
