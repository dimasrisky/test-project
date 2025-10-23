import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LogoutDto {
    @ApiProperty({ description: 'sessionId', example: ''})
    @IsString()
    sessionId: string;

    @ApiProperty({ description: 'refreshToken', example: ''})
    @IsString()
    refreshToken: string;    
}