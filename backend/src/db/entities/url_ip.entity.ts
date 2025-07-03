import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Urls } from "./urls.entity";

@Entity('url_ip')
export class Url_ip {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: false})
  ip: string;

  @Column({default: () => 'CURRENT_DATE'})
  click_date: Date;

  @Column({nullable:false})
  shortUrl: string
  
  @ManyToOne(()=>Urls, url=>url.shortUrl)
  @JoinColumn({name: 'shortUrl'})
  urls: string;

}