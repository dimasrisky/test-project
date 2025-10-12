import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class ResponseUserDto {
    @Expose()
    @ApiProperty({ description: 'ID user', example: 1 })
    @IsString()
    id: string;

    @Expose()
    @ApiProperty({ description: 'Nama user', example: 'Yanto' })
    @IsString()
    name: string;

    @Expose()
    @ApiProperty({ description: 'Alamat user', example: 'Malang' })
    @IsString()
    address: string;

    @Expose()
    @ApiProperty({ description: 'Status Tfa', example: false })
    @IsBoolean()
    isTfa: boolean;
}