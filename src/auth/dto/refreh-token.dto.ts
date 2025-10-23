import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({ description: 'email', example: ''})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'refreshToken', example: ''})
    @IsString()
    refreshToken: string;
}