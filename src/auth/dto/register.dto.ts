import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: 'nama', example: 'Dimas'})
    @IsString()
    name: string;

    @ApiProperty({ description: 'email', example: 'dimas@gmail.com'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'address', example: 'Malang'})
    @IsString()
    address: string;

    @ApiProperty({ description: 'password', example: 'dimas123'})
    @IsString()
    password: string;
}