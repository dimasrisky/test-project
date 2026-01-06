import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
<<<<<<< Updated upstream
import { TypeOrmModule } from '@nestjs/typeorm';
import { XenditModule } from './xendit/xendit.module';
=======
import { loggerMiddleware } from './middlewares/logger.middleware';
>>>>>>> Stashed changes

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule, 
    AuthModule, 
    DatabaseModule,
    XenditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(loggerMiddleware).forRoutes('*')
  }
}
