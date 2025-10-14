import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService
    ){}

    private async checkCredential(email: string, password: string): Promise<IUser>{
       const users = await this.databaseService.get('/users')
       const findUser = users.find(e => e.email === email && e.password === password)
       if(!findUser) throw new BadRequestException('invalidCredentials', 'Kredensial tidak valid')
       return findUser
    }

    async login(loginDto: LoginDto): Promise<ResponseLoginDto>{
        const user = await this.checkCredential(loginDto.email, loginDto.password)
        if(user.isTfa){
            return { accessToken: '', tfaRequired: true }
        }else{
            return { accessToken: this.jwtService.sign({ id: user.id, email: user.email, address: user.address, name: user.name, isTfa: user.isTfa }) }
        }
    }

    async getCurrentUser(user: IUser){
       const users = await this.databaseService.get('/users')
       const findUser = users.find(e => e.id === user.id)
       return findUser
    }

    async register(registerDto: RegisterDto): Promise<ResponseRegisterDto>{
        const _createUser = {
            ...registerDto,
            isTfa: false,
            tfaSecret: null,
            otpAuthUrl: null,
            id: uuidV4()
        }

        this.databaseService.push('/users[]', _createUser)

        return _createUser
    }
}
