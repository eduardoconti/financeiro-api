import { Test, TestingModule } from '@nestjs/testing';

import { CarteirasService } from './carteiras.service';

describe('CarteirasService', () => {
  let service: CarteirasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarteirasService],
    }).compile();

    service = module.get<CarteirasService>(CarteirasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
