// src/urls/__mocks__/entities.ts
export class Urls {
  id: number;
  originalUrl: string;
  expiresAt?: Date;
  alias?: string;
  shortUrl: string;
  createdAt: Date;
  clickCount: number;
  ips: Url_ip[];
}

export class Url_ip {
  id: number;
  ip: string;
  shortUrl: string;
  click_date: Date;
  urls: Urls;
}