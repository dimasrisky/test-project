import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { data } from 'node_modules/cheerio/dist/commonjs/api/attributes';
import puppeteer, { Browser, Page } from 'puppeteer'

@Injectable()
export class ScraperService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    private browser: Browser;

    // Data Hasil Scraping
    private productData: any[] = [];
    private hiddenProductsData: any[] = []
    private productTabData: any[] = []

    private async initBrowser() {
        this.browser = await puppeteer.launch()
    }

    @Cron('*/1 * * * *')
    async scrapeStaticContent() {
        console.log('Scraping Data....');
        await this.scrapeStaticWithPuppeteer()
        await this.scrapeHiddenProduct()
        console.log('Scraping Complete');
    }

    async getProductData() {
        return {
            data: {
                products: this.productData,
                total: this.productData.length
            }
        }
    }

    async getTabProducts(){
        await this.scrapeTabProduct()
        return {
            data: {
                data: this.productTabData,
                total: this.productTabData
            }
        }
    }

    async getHiddenProducts() {
        return {
            data: {
                products: this.hiddenProductsData,
                total: this.hiddenProductsData.length
            }
        }
    }


    async scrapeTabProduct(){
        await this.initBrowser()

        const page = await this.browser.newPage()

        await page.goto(this.configService.get<string>('WEB_TO_SCRAPE_URL')!, {
            waitUntil: 'networkidle2'
        })

        const result = await page.evaluate(() => {
           const tabs = Array.from(document.querySelectorAll('#tabs-container .tab-buttons'))
           const tabHeaders = tabs.map(el => {
                return el.getAttribute('data-tab')
           })

           const data = tabHeaders.map(el => {
                page.click(`#tabs-container .tab-buttons button[data-tab="${el}"]`)
                page.waitForSelector(`#tabs-container .tab-content div[data-pane="${el}"]`)

                const currentParentElement = document.querySelector(`#tabs-container .tab-content div[data-pane="${el}"]`)

                const titleFirst: string = currentParentElement?.querySelector(':nth-child(2) strong')?.textContent!
                const valueFirst = currentParentElement?.querySelector(':nth-child(2) span')?.textContent
                
                
                const titleSecond: string = currentParentElement?.querySelector(':nth-child(2) strong')?.textContent!
                const valueSecond = currentParentElement?.querySelector(':nth-child(3) span')?.textContent
                
                
                const titleThird: string = currentParentElement?.querySelector(':nth-child(2) strong')?.textContent!
                const valueThird = currentParentElement?.querySelector(':nth-child(4) span')?.textContent

                return {
                    tab: el,
                    data: {
                        [titleFirst]: valueFirst,
                        [titleSecond]: valueSecond,
                        [titleThird]: valueThird
                    }   
                }
           })

           return data
        })

        this.productTabData = [...this.productTabData, ...result]
    }

    async scrapeHiddenProduct() {
        await this.initBrowser()

        const page = await this.browser.newPage()
        await page.goto(this.configService.get<string>('WEB_TO_SCRAPE_URL')!, {
            waitUntil: 'networkidle2'
        })


        await page.click('#load-hidden-data-btn')
        await page.waitForSelector('#hidden-products-result', { visible: true })

        const result = await page.evaluate(() => {
            const hiddenProductElements = Array.from(document.querySelectorAll('#hidden-products-result ul li'))
            const data = hiddenProductElements.map(el => {
                const productName = el.querySelector('strong')?.textContent
                const price = `${el.childNodes[1]?.textContent} ${el.childNodes[2]?.textContent}`
                const inStockStatus = el.querySelector('.stock-badge')?.textContent

                return {
                    productName,
                    price,
                    inStockStatus
                }
            })

            return data
        })

        this.hiddenProductsData = [...this.hiddenProductsData, ...result]
    }

    async scrapeStaticWithPuppeteer() {
        try {
            await this.initBrowser()
            const page: Page = await this.browser.newPage()

            await page.goto(this.configService.get<string>('WEB_TO_SCRAPE_URL')!, {
                waitUntil: 'networkidle2'
            })

            const data = await page.evaluate(() => {
                const productData = Array.from(document.querySelectorAll('#static-products-table tbody tr'))

                return productData.map(el => {
                    const productName = el.querySelector('.product-name')?.textContent
                    const category = el.querySelector('.tag')?.textContent
                    const price = el.querySelector('.price')?.textContent
                    const rating = el.children[4].textContent

                    return {
                        productName,
                        category,
                        price,
                        rating
                    }
                })
            })

            this.productData = [...this.productData, ...data]
        } catch (error) {
            throw error
        }
    }

    async scrapeStatic(): Promise<any> {
        try {
            const response = await axios.get(this.configService.get('WEB_TO_SCRAPE_URL')!);
            console.log(response.data);
            const $ = cheerio.load(response.data);

            let headerData: string[] = []

            // Get Header table
            $('#static-products-table thead tr').each((index, element) => {
                const header = $(element).find('th').text().trim();
                headerData.push(header);
            })

            let bodyData: any[] = []

            $('#static-products-table tbody tr').each((index, element) => {
                const name = $(element).find('.product-name').text()
                const category = $(element).find('.tag').text()
                const price = $(element).find('.price')
                const rating = $(element).eq(4).text()

                bodyData.push({ name, category, price, rating })
            })

            return bodyData

        } catch (error) {
            throw error
        }
    }
}
