import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EnableTfaDto {
    @ApiProperty({ description: 'ID user', example: '', required: true })
    @IsNotEmpty()
    @IsString()
    id: string;
}