import { Test, TestingModule } from '@nestjs/testing';
import { ReceitaService } from './receitas.service';
import { Receitas } from '../entity/receitas.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('ReceitasService', () => {
  let service: ReceitaService;
  const mockRepository = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceitaService,
        {
          provide: getRepositoryToken(Receitas),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReceitaService>(ReceitaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
