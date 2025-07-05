import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Url_ip } from "./url_ip.entity";

@Entity('urls')
export class Urls {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  originalUrl: string;

  @Column({nullable: true})
  expiresAt: Date;

  @Column({nullable:true,length:20})
  alias: string;

  @Column({nullable:false,unique:true})
  shortUrl: string;

  @Column({nullable:false, default: () => 'CURRENT_DATE'})
  createdAt: Date;

  @Column({default: 0})
  clickCount: number;

  @OneToMany(()=>Url_ip, url=>url.urls)
  ips: Url_ip[]
}