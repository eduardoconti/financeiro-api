/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage, Repository } from 'typeorm';

import { Carteiras } from '@wallet/entity';
import { mockWalletEntity, mockWalletRequest } from '@wallet/mocks';

import { TYPES } from '@config/dependency-injection';

import { WalletRepository } from './wallet.repository';
import { IWalletRepository } from './wallet.repository.interface';

const walletMock: jest.Mocked<Carteiras> = mockWalletEntity;
describe('WalletRepository', () => {
  let ormRepository: Repository<Carteiras>;
  let walletRepository: IWalletRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.WalletRepository,
          useClass: WalletRepository,
        },
        {
          provide: getRepositoryToken(Carteiras),
          useClass: Repository,
        },
      ],
    }).compile();
    walletRepository = module.get<IWalletRepository>(TYPES.WalletRepository);
    ormRepository = module.get(getRepositoryToken(Carteiras));
  });

  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
    expect(ormRepository).toBeDefined();
  });

  it('should insert new wallet', async () => {
    const walletRequest = mockWalletRequest;
    const walletEntity = mockWalletEntity;

    jest.spyOn(ormRepository, 'create').mockImplementation(() => walletMock);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.resolve(walletEntity));

    const result = await walletRepository.insert(walletRequest);
    //expect(result).toEqual(walletMock);
    expect(result).toBeDefined();
  });
});
