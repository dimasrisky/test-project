import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Exchange } from 'src/bases/enums/exchange.enum';

@Global()
@Module({
    imports: [
        RabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                exchanges: [
                    { name: Exchange.BOOKS, type: 'direct' }
                ],
                uri: configService.get<string>('RABBITMQ_URL'),
                connectionInitOptions: { wait: true, timeout: 10000 },
            })
        })
    ],
    exports: [RabbitMQModule],
})
export class RabbitmqModule {}
