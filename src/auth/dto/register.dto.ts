import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: 'email', example: 'dimas@gmail.com'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'password', example: 'dimas123'})
    @IsString()
    password: string;
}