import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO untuk CustomerObject
 */
export class CustomerObjectDto {
  @ApiPropertyOptional({
    description: 'Nama depan customer',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  givenNames?: string;

  @ApiPropertyOptional({
    description: 'Nama belakang customer',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({
    description: 'Email customer',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nomor HP customer',
    example: '+6281234567890',
  })
  @IsOptional()
  @IsString()
  mobileNumber?: string;
}

/**
 * DTO untuk NotificationPreference
 */
export class NotificationPreferenceDto {
  @ApiPropertyOptional({
    description: 'Notifikasi ketika invoice dibuat',
    example: ['email'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  invoiceCreated?: string[];

  @ApiPropertyOptional({
    description: 'Notifikasi pengingat invoice',
    example: ['email'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  invoiceReminder?: string[];

  @ApiPropertyOptional({
    description: 'Notifikasi ketika invoice expired',
    example: ['email'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  invoiceExpired?: string[];

  @ApiPropertyOptional({
    description: 'Notifikasi ketika invoice paid',
    example: ['email'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  invoicePaid?: string[];
}

/**
 * DTO untuk InvoiceItem
 */
export class InvoiceItemDto {
  @ApiProperty({
    description: 'Nama item dalam invoice',
    example: 'Premium Subscription',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Jumlah item',
    example: 1,
  })
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    description: 'Harga per item',
    example: 10000,
  })
  @IsNumber()
  price!: number;
}

/**
 * DTO untuk InvoiceFee
 */
export class InvoiceFeeDto {
  @ApiProperty({
    description: 'Jenis fee',
    example: 'ADMIN',
  })
  @IsString()
  type!: string;

  @ApiProperty({
    description: 'Nominal fee',
    example: 2000,
  })
  @IsNumber()
  value!: number;
}

/**
 * DTO untuk ChannelProperties
 */
export class ChannelPropertiesDto {
  @ApiPropertyOptional({
    description: 'Nomor HP pelanggan (untuk e-wallet)',
    example: '+6281234567890',
  })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiPropertyOptional({
    description: 'URL redirect success',
    example: 'https://example.com/success',
  })
  @IsOptional()
  @IsString()
  successRedirectUrl?: string;
}

/**
 * MAIN DTO — CreateInvoiceRequest
 */
export class CreateInvoiceDto {
  @ApiProperty({
    description: 'External ID yang unik',
    example: 'invoice-12345',
  })
  @IsString()
  externalId!: string;

  @ApiProperty({
    description: 'Jumlah invoice dalam Rupiah',
    example: 15000,
  })
  @IsNumber()
  amount!: number;

  @ApiPropertyOptional({
    description: 'Email pelanggan',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsEmail()
  payerEmail?: string;

  @ApiPropertyOptional({
    description: 'Deskripsi invoice',
    example: 'Pembayaran paket premium',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Durasi invoice dalam detik',
    example: 3600,
  })
  @IsOptional()
  @IsNumber()
  invoiceDuration?: number;

  @ApiPropertyOptional({
    description: 'VA callback ID',
    example: 'va-123456',
  })
  @IsOptional()
  @IsString()
  callbackVirtualAccountId?: string;

  @ApiPropertyOptional({
    description: 'Apakah email notifikasi akan dikirim',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  shouldSendEmail?: boolean;

  @ApiPropertyOptional({
    description: 'Detail customer',
    type: CustomerObjectDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerObjectDto)
  customer?: CustomerObjectDto;

  @ApiPropertyOptional({
    description: 'Preferensi notifikasi customer',
    type: NotificationPreferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferenceDto)
  customerNotificationPreference?: NotificationPreferenceDto;

  @ApiPropertyOptional({
    description: 'URL redirect jika sukses',
    example: 'https://example.com/success',
  })
  @IsOptional()
  @IsString()
  successRedirectUrl?: string;

  @ApiPropertyOptional({
    description: 'URL redirect jika gagal',
    example: 'https://example.com/failed',
  })
  @IsOptional()
  @IsString()
  failureRedirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Metode pembayaran yang diizinkan',
    example: ['QRIS', 'OVO', 'DANA'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentMethods?: string[];

  @ApiPropertyOptional({
    description: 'Label tengah (opsional)',
    example: 'Order #123',
  })
  @IsOptional()
  @IsString()
  midLabel?: string;

  @ApiPropertyOptional({
    description: 'Butuh autentikasi kartu kredit?',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  shouldAuthenticateCreditCard?: boolean;

  @ApiPropertyOptional({
    description: 'Mata uang invoice',
    example: 'IDR',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Waktu pengingat',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  reminderTime?: number;

  @ApiPropertyOptional({
    description: 'Bahasa invoice',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({
    description: 'Satuan reminder time',
    example: 'minutes',
  })
  @IsOptional()
  @IsString()
  reminderTimeUnit?: string;

  @ApiPropertyOptional({
    description: 'List item dalam invoice',
    type: InvoiceItemDto,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  @IsArray()
  items?: InvoiceItemDto[];

  @ApiPropertyOptional({
    description: 'List biaya tambahan',
    type: InvoiceFeeDto,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InvoiceFeeDto)
  @IsArray()
  fees?: InvoiceFeeDto[];

  @ApiPropertyOptional({
    description: 'Channel properties (e-wallet/VA)',
    type: ChannelPropertiesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelPropertiesDto)
  channelProperties?: ChannelPropertiesDto;

  @ApiPropertyOptional({
    description:
      'Metadata tambahan (max 50 keys, value max 500 chars)',
    example: { userId: '123', plan: 'premium' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
