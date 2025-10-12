import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidV4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { EnableTfaDto } from './dto/enable-tfa.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly databaseService: DatabaseService
    ){}

    async findAll(): Promise<ResponseUserDto[]>{
        return await this.databaseService.get('/users')
    }

    async create(createDto: CreateUserDto): Promise<ResponseUserDto>{
        const _createUser = { ...createDto, id: uuidV4(), isTfa: false, tfaSecret: null }
        this.databaseService.push('/users[]', _createUser)
        return _createUser
    }

    async reset(): Promise<void>{
        await this.databaseService.delete('/users')
    }

    async enableTfa(enableTfaDto: EnableTfaDto){
        const users = await this.databaseService.get('/users')
        const index = users.findIndex((e: { id: string; }) => e.id === enableTfaDto.id)
        if(index === -1) throw new NotFoundException('user not found', 'notFound')
        await this.databaseService.push(`/users[${index}]/isTfa`, true)
        return await this.databaseService.get(`/users[${index}]`)
    }
}
