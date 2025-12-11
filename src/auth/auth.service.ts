import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidV4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refreh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService,
        private readonly configService: ConfigService
    ){}

    private async checkCredential(email: string, password: string): Promise<IUser>{
       const users = await this.databaseService.get('/users')
       const findUser = users.find(e => e.email === email && e.password === password)
       if(!findUser) throw new BadRequestException('invalidCredentials', 'Kredensial tidak valid')
       return findUser
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto){
        const users = await this.databaseService.get('/users')
        const user = users.find(e => e.email === refreshTokenDto.email)
        if(!user) throw new BadRequestException('invalidCredentials', 'Kredensial tidak valid')
        const verifyRefreshToken = this.jwtService.verify(refreshTokenDto.refreshToken)
        if(!verifyRefreshToken) throw new BadRequestException('invalidRefreshToken', 'Refresh token tidak valid')
        const sessionId = uuidV4()
        const payload = { id: user.id, email: user.email, address: user.address, name: user.name, isTfa: user.isTfa }
        return { 
            sessionId,
            accessToken: this.jwtService.sign(payload, { expiresIn: (this.configService.get<string>('JWT_EXPIRES') || '1h') as any }),
            refreshToken: refreshTokenDto.refreshToken
        }
    }
    

    async login(loginDto: LoginDto): Promise<ResponseLoginDto>{
        const user = await this.checkCredential(loginDto.email, loginDto.password)
        const sessionId = uuidV4()
        if(user.isTfa){
            return { sessionId: '', accessToken: '', refreshToken: '', tfaRequired: user.isTfa }
        }else{
            return { 
                sessionId,
                accessToken: this.jwtService.sign({ id: user.id, email: user.email, address: user.address, name: user.name, isTfa: user.isTfa }),
                refreshToken: this.jwtService.sign({ id: user.id, email: user.email, address: user.address, name: user.name, isTfa: user.isTfa }),
                tfaRequired: user.isTfa
            }
        }
    }

    async logout(logoutDto: LogoutDto): Promise<void>{
        const tokens = await this.databaseService.get('/refreshTokens')
        const index = tokens.findIndex((token: { sessionId: string; refreshToken: string; revoked: boolean; }) => token.sessionId === logoutDto.sessionId && logoutDto.refreshToken === token.refreshToken && token.revoked === false)
        await this.databaseService.push(`/refreshTokens[${index}]/revoked`, true)
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
