import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class ResponseLogoutDto {
    @Expose()
    @ApiProperty({ description: 'message', example: 'success' })
    @IsString()
    message: string;
}