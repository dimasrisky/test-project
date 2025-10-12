import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UnauthorizedException {
    @ApiProperty({ description: 'message', example: 'Unauthorized'})
    @IsString()
    message: string;

    @ApiProperty({ description: 'status code', example: 401})
    @IsNumber()
    statusCode: number;
}