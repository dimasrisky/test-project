import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ResponseScrapeDto } from './dto/response-scrape.dto';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
    constructor(
        private readonly scraperService: ScraperService
    ) {}

    @Get('scrape-static')
    @ApiOkResponse({ description: 'Scrape data from the specified URL', type: ResponseScrapeDto })
    async scrape(){
        return await this.scraperService.scrapeStatic()
    }

    @Get('scrape-puppeteer')
    @ApiOkResponse({ description: 'Scrape data from the specified URL', type: ResponseScrapeDto })
    async scrapePuppeter(){
        return await this.scraperService.getProductData()
    }

    @Get('scrape-puppeteer-hidden-products')
    @ApiOkResponse({ description: 'Scrape data from the specified URL', type: ResponseScrapeDto })
    async scrapePuppeterHiddenProducts(){
        return await this.scraperService.getHiddenProducts()
    }
    
    @Get('scrape-puppeteer-tab-products')
    @ApiOkResponse({ description: 'Scrape data from the specified URL', type: ResponseScrapeDto })
    async scrapeTabProducts(){
        return await this.scraperService.getTabProducts()
    }
}
