// callback-payment-gateway.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class WebhookCallbackDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  external_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  is_high: boolean;

  @ApiProperty()
  @IsString()
  payment_method: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsString()
  @ApiProperty()
  merchant_name: string;

  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsNumber()
  @ApiProperty()
  paid_amount: number;

  @ApiProperty()
  @IsOptional()
  bank_code: string;

  @IsDateString()
  @ApiProperty()
  paid_at: string;

  @ApiProperty()
  @IsOptional()
  payer_email: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsOptional()
  adjusted_received_amount: number;

  @ApiProperty()
  @IsOptional()
  fees_paid_amount: number;

  @IsDateString()
  @ApiProperty()
  updated: string;

  @IsDateString()
  @ApiProperty()
  created: string;

  @IsString()
  @ApiProperty()
  currency: string;

  @ApiProperty()
  @IsOptional()
  payment_channel: string;

  @ApiProperty()
  @IsOptional()
  payment_destination: string;
}
