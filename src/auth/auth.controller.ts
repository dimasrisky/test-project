import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { RegisterDto } from './dto/register.dto';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from './interfaces/user.interface';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { RefreshTokenDto } from './dto/refreh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    @ApiCreatedResponse({
        description: 'success',
        type: ResponseLoginDto
    })
    async login(@Body() loginDto: LoginDto){
        return await this.authService.login(loginDto)
    }

    @Get('me')
    @ApiCreatedResponse({
        description: 'success',
        type: ResponseUserDto
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async currentUser(
        @Request() req: express.Request
    ){
        return await this.authService.getCurrentUser(req.user as IUser)
    }

    @Post('refresh-token')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOkResponse({
        description: 'success',
        type: ResponseLoginDto
    })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
        return await this.authService.refreshToken(refreshTokenDto)
    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async logout(@Body() logoutDto: LogoutDto): Promise<void>{
        return await this.authService.logout(logoutDto)
    }


    @Post('register')
    @ApiCreatedResponse({
        description: 'success',
        type: ResponseRegisterDto
    })
    async register(@Body() registerDto: RegisterDto): Promise<ResponseRegisterDto>{
        return await this.authService.register(registerDto)
    }
}
