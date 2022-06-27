import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Carteiras } from '@wallet/entity';
import {
  DeleteWalletException,
  FindWalletException,
  ForbiddenWalletException,
  InsertWalletException,
  UpdateWalletException,
} from '@wallet/exception';
import { mockWalletEntity, mockWalletRequest } from '@wallet/mocks';

import { TYPES } from '@config/dependency-injection';

import { fakeUserId } from '@expense/mocks';

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
    jest.spyOn(ormRepository, 'create').mockImplementation(() => walletMock);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));

    const result = await walletRepository.insert(mockWalletRequest);
    expect(result).toEqual(mockWalletEntity);
  });

  it('should throw InsertWalletException', async () => {
    jest.spyOn(ormRepository, 'create').mockImplementation(() => walletMock);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.reject(new Error('error')));

    await expect(
      walletRepository.insert(mockWalletRequest),
    ).rejects.toThrowError(InsertWalletException);
  });

  it('should update wallet', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));
    jest.spyOn(ormRepository, 'create').mockImplementation(() => walletMock);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));

    const result = await walletRepository.update(
      mockWalletEntity.id as number,
      fakeUserId,
      mockWalletRequest,
    );
    expect(result).toEqual(mockWalletEntity);
  });

  it('should throw UpdateWalletException', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));
    jest.spyOn(ormRepository, 'create').mockImplementation(() => walletMock);
    jest
      .spyOn(ormRepository, 'save')
      .mockImplementation(() => Promise.reject(new Error('error')));

    await expect(
      walletRepository.update(
        mockWalletEntity.id as number,
        fakeUserId,
        mockWalletRequest,
      ),
    ).rejects.toThrowError(UpdateWalletException);
  });

  it('should call findById', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));

    const result = await walletRepository.findById(
      mockWalletEntity.id as number,
    );
    expect(result).toEqual(mockWalletEntity);
    expect(ormRepository.findOneOrFail).toHaveBeenCalledWith({
      relations: ['user'],
      where: { id: mockWalletEntity.id as number },
    });
  });

  it('should throw FindWalletException when call findById', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.reject(new Error('error')));
    await expect(
      walletRepository.findById(mockWalletEntity.id as number),
    ).rejects.toThrowError(FindWalletException);
  });

  it('should call find', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockImplementation(() => Promise.resolve([mockWalletEntity]));

    const result = await walletRepository.find(mockWalletEntity.userId);
    expect(result).toEqual([mockWalletEntity]);
    expect(ormRepository.find).toHaveBeenCalledWith({
      order: { descricao: 'ASC' },
      relations: ['user'],
      where: { userId: mockWalletEntity.userId },
    });
  });

  it('should throw FindWalletException when call find', async () => {
    jest
      .spyOn(ormRepository, 'find')
      .mockImplementation(() => Promise.reject(new Error('error')));
    await expect(
      walletRepository.find(mockWalletEntity.userId),
    ).rejects.toThrowError(FindWalletException);
  });

  it('should call delete', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));
    jest
      .spyOn(ormRepository, 'remove')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));

    const result = await walletRepository.delete(
      mockWalletEntity.id as number,
      mockWalletEntity.userId,
    );
    expect(result).toEqual({ deleted: true });
  });

  it('should throw ForbiddenWalletException when call delete', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));
    await expect(
      walletRepository.delete(mockWalletEntity.id as number, 'otherUserId'),
    ).rejects.toThrowError(ForbiddenWalletException);
  });

  it('should throw DeleteWalletException when call delete', async () => {
    jest
      .spyOn(ormRepository, 'findOneOrFail')
      .mockImplementation(() => Promise.resolve(mockWalletEntity));

    jest
      .spyOn(ormRepository, 'remove')
      .mockImplementation(() => Promise.reject(new Error('orm error')));
    await expect(
      walletRepository.delete(
        mockWalletEntity.id as number,
        mockWalletEntity.userId,
      ),
    ).rejects.toThrowError(DeleteWalletException);
  });
});
