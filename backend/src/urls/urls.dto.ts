import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateUrlDto {
  @IsUrl()
  readonly originalUrl: string;

  @IsOptional()
  @IsDateString()
  readonly expiresAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly alias?: string;
  
}