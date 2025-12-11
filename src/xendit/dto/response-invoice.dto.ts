import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ResponseInvoiceDto {
    @Expose()
    @ApiProperty()
    externalId: string

    @Expose()
    @ApiProperty()
    amount: number

    @Expose()
    @ApiProperty()
    description?: string
}