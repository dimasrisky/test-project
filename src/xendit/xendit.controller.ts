import { BadRequestException, Body, Controller, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { XenditService } from "./xendit.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { ResponseInvoiceDto } from "./dto/response-invoice.dto";
import { WebhookCallbackDto } from "./dto/webhook-callback.dto";
import { ConfigService } from "@nestjs/config";

@Controller('xendit')
export class XenditController {
    constructor(
        private readonly xenditService: XenditService,
        private readonly configService: ConfigService
    ){}

    @Post()
    @ApiOkResponse({ description: 'Berhasil', type: ResponseInvoiceDto })
    async createInvoice(
        @Body() createDto: CreateInvoiceDto
    ): Promise<ResponseInvoiceDto> {
        const result = await this.xenditService.createInvoice(createDto)
        return result
    }

    @Post('webhook')
    async handleCallback(
        @Body() webhookDto: WebhookCallbackDto,
        @Headers('x-callback-token') webhookToken: string
    ): Promise<boolean>{
        if(!webhookToken || webhookToken != this.configService.get('XENDIT_WEBHOOK_VERIFICATION_TOKEN')){
            console.log('masuksini');
            throw new UnauthorizedException()
        }
        return this.xenditService.webhookCallback(webhookDto)
    }
}