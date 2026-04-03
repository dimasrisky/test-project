import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { v4 as uuidv4 } from 'uuid';
import * as speakeasy from 'speakeasy';
import { IUser } from './interfaces/user.interface';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('speakeasy', () => ({
  generateSecret: jest.fn(),
  totp: {
    verify: jest.fn().mockReturnValue(true)
  }
}))

describe('UserService', () => {
  let service: UserService;

  const mockDatabaseService = {
    push: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAmqpConnection = {
    request: jest.fn(),
    publish: jest.fn(),
  };

  // Mock uuid (uuid)
  const uuidMock = 'test-uuid-0000';

  // Mock speakeasy
  const mcokBase32 = 'aoaihdoiawhdoiahw'
  const mock_otpauth_url = 'http://example.png'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AmqpConnection,
          useValue: mockAmqpConnection,
        },
      ],
    }).compile();

    (uuidv4 as jest.Mock).mockReturnValue(uuidMock);
    (speakeasy.generateSecret as jest.Mock).mockReturnValue({
      base32: mcokBase32,
      otpauth_url: mock_otpauth_url
    })
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create() - create user', () => {
    it('should create user', async () => {
      const mockUser: CreateUserDto = {
        email: 'johndoe@gmail.com',
        name: 'John',
        address: 'malang',
        password: 'john123',
      };

      const expectedUser = {
        ...mockUser,
        id: uuidMock,
        isTfa: false,
        tfaSecret: null,
        otpAuthUrl: null,
      };

      mockDatabaseService.push.mockReturnValue(undefined)
      const result = await service.create(mockUser);

      expect(mockDatabaseService.push).toHaveBeenCalledWith('/users[]', expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll() - get all users', () => {
    it('should getting array of all users', async () => {
      mockDatabaseService.get.mockReturnValue([])
      const result = await service.findAll()
      expect(mockDatabaseService.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual([])
    })
  })

  describe('reset() - resetting users data', () => {
    it('should resetting users data', async () => {
      mockDatabaseService.delete.mockReturnValue(undefined)
      await service.reset()
      expect(mockDatabaseService.delete).toHaveBeenCalledWith('/users')
    })
  })

  describe('enableTfa() - enabling 2 factor authentication', () => {
    it('should be activating 2fa', async () => {
      const mockUser: IUser = { id: '0000-111', name: 'johndoe', address: 'malang', email: 'johndoe@gmail.com', isTfa: false }
      mockDatabaseService.get.mockReturnValue([{
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        address: mockUser.address,
        isTfa: false,
        tfaSecret: null,
        otpAuthUrl: null
      }])
      const result = await service.enableTfa(mockUser)
      expect(mockDatabaseService.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual({
        otpauthUrl: mock_otpauth_url,
        isTfa: true
      })
    })
  })

  describe('verifyTfa() - verify 2fa secret', () => {
    it('should verify 2fa secret', async () => {
      const mockUser = {
        id: uuidMock,
        name: 'john',
        email: 'johndoe@gmail.com',
        address: 'malang',
        tfaSecret: 'paohdapodhuapodjupodu'
      }
      const mockToken = '89909'
      const mockAccessToken = 'apihdoipawhdoihawdoia'
      mockDatabaseService.get.mockReturnValue([mockUser])
      mockJwtService.sign.mockReturnValue(mockAccessToken)
      const result = await service.verifyTfa(mockUser.email, mockToken)
      expect(mockDatabaseService.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual({ accessToken: mockAccessToken })
    })
  })

  describe('disableTfa() - disabling 2fa', () => {
    it('should disabling 2fa for user', async () => {
      const mockUser = {
        id: uuidMock,
        name: 'john',
        email: 'johndoe@gmail.com',
        address: 'malang',
        tfaSecret: 'paohdapodhuapodjupodu',
        isTfa: true
      }
      mockDatabaseService.get.mockReturnValue([mockUser])
      const result = await service.disableTfa(mockUser)
      expect(mockDatabaseService.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual(true)
    })
  })
});
