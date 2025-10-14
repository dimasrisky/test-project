import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class ResponseLoginDto {
    @Expose()
    @ApiProperty({ description: 'Access Token'})
    @IsString()
    accessToken: string;

    @Expose()
    @ApiPropertyOptional({ description: 'Tfa Required', example: false })
    @IsOptional()
    tfaRequired?: boolean;
}