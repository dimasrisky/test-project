import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { RegisterDto } from './dto/register.dto';

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

    @Post('register')
    @ApiCreatedResponse({
        description: 'success',
        type: ResponseRegisterDto
    })
    async register(@Body() registerDto: RegisterDto){
        return await this.authService.register(registerDto)
    }
}
