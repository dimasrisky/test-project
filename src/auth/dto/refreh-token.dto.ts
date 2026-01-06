import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({ description: 'email', example: ''})
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'session id', example: ''})
    @IsString()
    sessionId: string;

    @ApiProperty({ description: 'refresh token', example: ''})
    @IsString()
    refreshToken: string;    
}