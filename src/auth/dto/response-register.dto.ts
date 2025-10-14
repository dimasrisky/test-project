import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ResponseRegisterDto {
    @ApiProperty({ description: 'id', example: 1})
    @IsString()
    id: string;

    @ApiProperty({ description: 'name', example: 'dimas'})
    @IsString()
    name: string;

    @ApiProperty({ description: 'email', example: 'dimas@gmail.com'})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'address', example: 'Malang'})
    @IsString()
    address: string;
}