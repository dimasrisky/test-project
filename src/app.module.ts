import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule, 
    AuthModule, DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
