import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class ResponseRegisterDto {
    @ApiProperty({ description: 'id', example: 1})
    @IsString()
    id: string;

    @ApiProperty({ description: 'email', example: 'dimas@gmail.com'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'password', example: 'dimas123'})
    @IsString()
    password: string;
}