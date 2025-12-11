import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Xendit, { Invoice } from 'xendit-node'
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { WebhookCallbackDto } from "./dto/webhook-callback.dto";

@Injectable()
export class XenditService {
    private xendit: Xendit
    constructor(
        private readonly configService: ConfigService
    ){
        this.xendit = new Xendit({
            secretKey: this.configService.get('XENDIT_SECRET_KEY') ?? ''
        })
    }

    async createInvoice(createDto: CreateInvoiceDto){
        const invoiceApi = this.xendit.Invoice
        const invoice = await invoiceApi.createInvoice({
            data: {
                externalId: `INV-${Date.now()}`,
                amount: createDto.amount,
                description: 'Pembayaran Invoice',
                successRedirectUrl: 'https://4cdd4e80d869.ngrok-free.app/api',
                failureRedirectUrl: 'https://4cdd4e80d869.ngrok-free.app/api',
            }
        });

        return invoice
    }

    async webhookCallback(webhookDto: WebhookCallbackDto){
        console.log(webhookDto);
        return true
    }
}