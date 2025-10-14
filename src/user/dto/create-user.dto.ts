import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @Expose()
    @ApiProperty({ description: 'Email user', example: 'yanto@gmail.com' })
    @IsEmail()
    email: string;

    @Expose()
    @ApiProperty({ description: 'Nama user', example: 'Yanto' })
    @IsString()
    name: string;

    @Expose()
    @ApiProperty({ description: 'Alamat user', example: 'Malang' })
    @IsString()
    address: string;

    @Expose()
    @ApiProperty({ description: 'Password user', example: '' })
    @IsString()
    password: string;
}