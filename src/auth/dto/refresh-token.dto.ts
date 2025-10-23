import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty({ description: 'email', example: 'dimas@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'refresh token', example: 'ajodoawdoiaho'})
    @IsString()
    refreshToken: string;
}