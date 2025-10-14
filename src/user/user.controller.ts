import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from 'src/templates/exceptions/unauthorized.exception';
import express from 'express';
import { IUser } from './interfaces/user.interface';
import { ResponseLoginDto } from 'src/auth/dto/response-login.dto';
import { VerifyTfaDto } from './dto/verify-tfa.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post()
    @ApiCreatedResponse({
        description: 'success',
        type: ResponseUserDto
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() createDto: CreateUserDto): Promise<ResponseUserDto>{
        return await this.userService.create(createDto)
    }

    @Get()
    @ApiOkResponse({
        description: 'success',
        type: ResponseUserDto
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<ResponseUserDto[]>{
        return await this.userService.findAll()
    }

    @Get('reset')
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async reset(){
        return await this.userService.reset()
    }

    @Get('enable-tfa')
    @ApiOkResponse({
        description: 'success',
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async enableTfa(
        @Request() req: express.Request
    ){
        return await this.userService.enableTfa(req.user! as IUser)
    }

    @Get('disable-tfa')
    @ApiOkResponse({
        description: 'success',
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))    
    async disableTfa(
        @Request() req: express.Request
    ){
        return await this.userService.disableTfa(req.user! as IUser)
    }

    @Post('verify-tfa')
    @ApiOkResponse({
        description: 'success',
        type: ResponseLoginDto
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    async verifyTfa(
        @Body() body: VerifyTfaDto
    ){
        return await this.userService.verifyTfa(body.email, body.token)
    }
}
