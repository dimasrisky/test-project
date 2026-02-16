import { ApiProperty } from "@nestjs/swagger";

export class ResponseScrapeDto {
    @ApiProperty({ description: 'The scraped data' })
    data: any;
}