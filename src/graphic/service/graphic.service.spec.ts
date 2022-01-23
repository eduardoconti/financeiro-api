import { Test, TestingModule } from '@nestjs/testing';
import { GraphicService } from './graphic.service';

describe('GraphicService', () => {
  let service: GraphicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphicService],
    }).compile();

    service = module.get<GraphicService>(GraphicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
