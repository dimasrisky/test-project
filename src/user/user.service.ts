import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidV4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import * as speakeasy from 'speakeasy';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Exchange } from 'src/bases/enums/exchange.enum';
import { RoutingKey } from 'src/bases/enums/routingkey.enum';

@Injectable()
export class UserService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private amqpConnection: AmqpConnection
    ){}

    async findAll(): Promise<ResponseUserDto[]>{
        const result = await this.amqpConnection.request({
            exchange: Exchange.BOOKS,
            routingKey: RoutingKey.LIST_BOOK_QUEUE,
            payload: { name: 'dimas' }
        })
        await this.amqpConnection.publish(Exchange.BOOKS, RoutingKey.BOOK_SAYHI, { name: 'dimas' })
        console.log(result);
        return await this.databaseService.get('/users')
    }

    async create(createDto: CreateUserDto): Promise<ResponseUserDto>{
        const _createUser = { ...createDto, id: uuidV4(), isTfa: false, tfaSecret: null, otpAuthUrl: null }
        this.databaseService.push('/users[]', _createUser)
        return _createUser
    }

    async reset(): Promise<void>{
        await this.databaseService.delete('/users')
    }

    async enableTfa(user: IUser){
        const users = await this.databaseService.get('/users')
        const index = users.findIndex((e: { id: string; }) => e.id === user.id)
        if(index === -1) throw new NotFoundException('user not found', 'notFound')
        const speakeasySecret = await speakeasy.generateSecret({ length: 20, name: `Test Project`, issuer: 'Test Project' })
        await this.databaseService.push(`/users[${index}]/isTfa`, true)
        await this.databaseService.push(`/users[${index}]/tfaSecret`, speakeasySecret.base32)
        await this.databaseService.push(`/users[${index}]/otpAuthUrl`, speakeasySecret.otpauth_url)
        return {
            otpauthUrl: speakeasySecret.otpauth_url,
            isTfa: true
        }
    }

    async verifyTfa(email: string, token: string){
        const users = await this.databaseService.get('/users')
        const findUser = users.find((e: { email: string; }) => e.email === email)
        if(!findUser) throw new NotFoundException('user not found', 'notFound')
        const verify = speakeasy.totp.verify({
            secret: findUser.tfaSecret,
            encoding: 'base32',
            token,
            window: 1
        })
        if(!verify) throw new NotFoundException('invalid token', 'invalidToken')
        return { accessToken: this.jwtService.sign({ id: findUser.id, email: findUser.email, address: findUser.address, name: findUser.name, isTfa: findUser.isTfa }) }
    }

    async disableTfa(user: IUser){
        const users = await this.databaseService.get('/users')
        const index = users.findIndex((e: { id: string; }) => e.id === user.id)
        if(index === -1) throw new NotFoundException('user not found', 'notFound')
        await this.databaseService.push(`/users[${index}]/isTfa`, false)
        await this.databaseService.push(`/users[${index}]/tfaSecret`, null)
        await this.databaseService.push(`/users[${index}]/otpAuthUrl`, null)
        return true
    }
}
