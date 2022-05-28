import { InternalServerErrorException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PasswordHashCompareException } from '@users/exception';

import { TYPES } from '@config/dependency-injection';

import { PasswordManagerService } from './password-mannager.service';
import { IPasswordManagerService } from './password-mannager.service.interface';

describe('PasswordMannagerService', () => {
  let passwordManagerService: IPasswordManagerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.PasswordManagerService,
          useClass: PasswordManagerService,
        },
      ],
    }).compile();

    passwordManagerService = module.get<IPasswordManagerService>(
      TYPES.PasswordManagerService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(passwordManagerService).toBeDefined();
  });

  it('should be able to get hash', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(
        () => '$2b$15$ns/MwkrMENUuOtbDwVf8xuOAHKRg/KRa2AOGtzeb87BEtMbIObc5i',
      );
    const hash = await passwordManagerService.getHash('test');
    expect(hash).toBeDefined();
  });

  it('should be able to compare hash', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    const result = await passwordManagerService.compareHash(
      'test',
      '$2b$15$ns/MwkrMENUuOtbDwVf8xuOAHKRg/KRa2AOGtzeb87BEtMbIObc5i',
    );
    expect(result).toBe(true);
  });

  it('should throw error when compare hash', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
      throw new InternalServerErrorException();
    });

    await expect(
      passwordManagerService.compareHash(
        'test',
        '$2b$15$ns/MwkrMENUuOtbDwVf8xuOAHKRg/KRa2AOGtzeb87BEtMbIObc5i',
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw error when get hash', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      throw new InternalServerErrorException();
    });
    expect(passwordManagerService.getHash('test')).rejects.toThrow();
  });

  it('should throw PasswordHashCompareException when compare hash', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
      false;
    });
    await expect(
      passwordManagerService.compareHash(
        'test',
        '$2bENUuOtbDwVf8xuOAHKRg/KRa2AOGtzeb87BEtMbIObc5i',
      ),
    ).rejects.toThrow(PasswordHashCompareException);
  });
});
