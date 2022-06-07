/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage, Repository } from 'typeorm';

import { Carteiras } from '@wallet/entity';
import { mockWalletEntity, mockWalletRequest } from '@wallet/mocks';

import { TYPES } from '@config/dependency-injection';

import { WalletRepository } from './wallet.repository';
import { IWalletRepository } from './wallet.repository.interface';

const walletMock: jest.Mocked<Carteiras> = mockWalletEntity;
describe('WalletRepository', () => {
  let repository: Repository<Carteiras>;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Carteiras]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            autoLoadEntities: true,
            synchronize: false,
            host: process.env.POSTGRES_HOST,
            port: 5430,
            username: 'admin',
            password: 'admin',
            database: 'financeiro',
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            //ssl: { rejectUnauthorized: false },
          }),
        }),
      ],
      providers: [
        {
          provide: TYPES.WalletRepository,
          useClass: WalletRepository,
        },
        // {
        //   provide: Repository,
        //   useValue: {
        //     findOneOrFail: jest.fn(),
        //     find: jest.fn(),
        //     save: jest.fn(),
        //     update: jest.fn(),
        //     delete: jest.fn(),
        //     create: jest.fn(),
        //   },
        // },
      ],
    }).compile();

    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
    //repository = module.get(Repository);
  });
  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    //expect(repository).toBeDefined();
  });

  it('should insert new wallet', async () => {
    const walletRequest = mockWalletRequest;
    const walletEntity = mockWalletEntity;

    // jest.spyOn(repository, 'create').mockImplementation(() => walletMock);
    // jest
    //   .spyOn(repository, 'save')
    //   .mockImplementation(() => Promise.resolve(walletEntity));

    const result = await walletRepository.insert(walletRequest);
    //expect(result).toEqual(walletMock);
    expect(result).toBeDefined();
  });
});
