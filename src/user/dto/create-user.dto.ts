import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class CreateUserDto {
    @Expose()
    @ApiProperty({ description: 'Nama user', example: 'Yanto' })
    @IsString()
    name: string;

    @Expose()
    @ApiProperty({ description: 'Alamat user', example: 'Malang' })
    @IsString()
    address: string;
}