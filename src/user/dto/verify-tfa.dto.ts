import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyTfaDto {
    @ApiProperty({ description: 'token', example: '123456'})
    @IsString()
    token: string;

    @ApiProperty({ description: 'email', example: ''})
    @IsString()
    email: string;
}