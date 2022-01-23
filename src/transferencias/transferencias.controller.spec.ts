import { Test, TestingModule } from '@nestjs/testing';

import { TransferenciasController } from './transferencias.controller';

describe('TransferenciasController', () => {
  let controller: TransferenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenciasController],
    }).compile();

    controller = module.get<TransferenciasController>(TransferenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
