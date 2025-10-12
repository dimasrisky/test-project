import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from 'src/templates/exceptions/unauthorized.exception';
import { EnableTfaDto } from './dto/enable-tfa.dto';

@Controller('user')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
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
    async findAll(): Promise<ResponseUserDto[]>{
        return await this.userService.findAll()
    }

    @Get('reset')
    @HttpCode(200)
    async reset(){
        return await this.userService.reset()
    }

    @Get('enable-tfa/:id')
    @ApiOkResponse({
        description: 'success',
        type: ResponseUserDto
    })
    @ApiUnauthorizedResponse({
        description: 'unauthorized',
        type: UnauthorizedException
    })
    async enableTfa(
        @Param() paramDto: EnableTfaDto
    ): Promise<ResponseUserDto>{
        return await this.userService.enableTfa(paramDto)
    }
}
