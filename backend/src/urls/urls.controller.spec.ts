// src/urls/urls.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

// Мокаем сервис полностью
const mockUrlsService = {
  create_short: jest.fn(),
  redir: jest.fn(),
  info: jest.fn(),
  del: jest.fn(),
  analyt: jest.fn(),
};

describe('UrlsController - Redirect', () => {
  let controller: UrlsController;
  let service: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: mockUrlsService, // Используем мок
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);

    jest.clearAllMocks();
  });

  describe('GET /:shortUrl (redirect)', () => {
    it('должен вернуть URL для редиректа', async () => {
      // Arrange
      const shortUrl = 'abc123';
      const clientIp = '192.168.1.1';
      const originalUrl = 'https://www.google.com';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(service.redir).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен обработать разные IP адреса', async () => {
      // Arrange
      const shortUrl = 'abc123';
      const clientIp = '10.0.0.1';
      const originalUrl = 'https://www.example.com';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен обработать IPv6 адрес', async () => {
      // Arrange
      const shortUrl = 'abc123';
      const clientIp = '2001:db8::1';
      const originalUrl = 'https://www.example.com';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен выбросить NotFoundException для несуществующей ссылки', async () => {
      // Arrange
      const shortUrl = 'notfound';
      const clientIp = '192.168.1.1';

      mockUrlsService.redir.mockRejectedValue(
        new NotFoundException('Такой ссылки нету')
      );

      // Act & Assert
      await expect(controller.redir(shortUrl, clientIp)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.redir(shortUrl, clientIp)).rejects.toThrow(
        'Такой ссылки нету'
      );

      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
    });

    it('должен выбросить ConflictException для истекшей ссылки', async () => {
      // Arrange
      const shortUrl = 'expired123';
      const clientIp = '192.168.1.1';

      mockUrlsService.redir.mockRejectedValue(
        new ConflictException('Срок действия ссылки истек')
      );

      // Act & Assert
      await expect(controller.redir(shortUrl, clientIp)).rejects.toThrow(
        ConflictException
      );
      await expect(controller.redir(shortUrl, clientIp)).rejects.toThrow(
        'Срок действия ссылки истек'
      );

      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
    });

    it('должен работать с кастомным alias', async () => {
      // Arrange
      const shortUrl = 'my-custom-alias';
      const clientIp = '192.168.1.1';
      const originalUrl = 'https://www.example.com/very/long/path';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен работать с длинными URL', async () => {
      // Arrange
      const shortUrl = 'abc123';
      const clientIp = '192.168.1.1';
      const originalUrl = 'https://www.example.com/very/long/path/with/many/parameters?param1=value1&param2=value2&param3=value3';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен работать с URL содержащими специальные символы', async () => {
      // Arrange
      const shortUrl = 'abc123';
      const clientIp = '192.168.1.1';
      const originalUrl = 'https://www.example.com/search?q=test%20query&lang=ru';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      const result = await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(result).toEqual({ url: originalUrl });
    });

    it('должен правильно передавать параметры сервису', async () => {
      // Arrange
      const shortUrl = 'test123';
      const clientIp = '203.0.113.1';
      const originalUrl = 'https://www.test.com';

      mockUrlsService.redir.mockResolvedValue(originalUrl);

      // Act
      await controller.redir(shortUrl, clientIp);

      // Assert
      expect(service.redir).toHaveBeenCalledWith(clientIp, shortUrl);
      expect(service.redir).toHaveBeenCalledWith(
        expect.stringMatching(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/), // IP validation
        expect.stringMatching(/^[a-zA-Z0-9-_]+$/) // shortUrl validation
      );
    });
  });
});