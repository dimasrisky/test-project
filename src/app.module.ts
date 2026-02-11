import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { XenditModule } from './xendit/xendit.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { GatewayModule } from './gateway/gateway.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    RabbitmqModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    XenditModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(loggerMiddleware).forRoutes('*')
  }
}
