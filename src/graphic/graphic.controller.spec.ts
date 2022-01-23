import { Test, TestingModule } from '@nestjs/testing';
import { GraphicController } from './graphic.controller';

describe('GraphicController', () => {
  let controller: GraphicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphicController],
    }).compile();

    controller = module.get<GraphicController>(GraphicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
