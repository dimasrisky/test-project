import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ResponseLoginDto {
    @Expose()
    @ApiProperty({ description: 'Session ID'})
    @IsString()
    sessionId: string;

    @Expose()
    @ApiProperty({ description: 'Access Token'})
    @IsString()
    accessToken: string;

    @Expose()
    @ApiProperty({ description: 'Refresh Token'})
    @IsString()
    refreshToken: string;

    @Expose()
    @ApiPropertyOptional({ description: 'Tfa Required', example: false })
    @IsOptional()
    tfaRequired?: boolean;
}