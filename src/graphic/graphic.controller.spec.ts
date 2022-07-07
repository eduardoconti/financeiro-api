import { Test, TestingModule } from '@nestjs/testing';

import { UserPayloadDto } from '@auth/dto';

import { UserDTO } from '@users/dto';
import { Users } from '@users/entity';

import { TYPES } from '@config/dependency-injection';

import { GeneralGraphicResponseDTO } from './dto/general-graphic';
import { GraphicController } from './graphic.controller';
import { IGraphicService } from './service';
const fakeUserDTO: UserDTO = new UserDTO();
fakeUserDTO.login = 'test';
fakeUserDTO.nome = 'test';
fakeUserDTO.password = 'test';
fakeUserDTO.status = 1;
fakeUserDTO.perfil = 1;

const fakeUserEntity: Users = Users.build(fakeUserDTO);

const fakeUserPayloadDto: UserPayloadDto = new UserPayloadDto(fakeUserEntity);

describe('GraphicController', () => {
  let controller: GraphicController;
  let graphicService: IGraphicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphicController],
      providers: [
        {
          provide: TYPES.GraphicService,
          useValue: {
            generalGraphic: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GraphicController>(GraphicController);
    graphicService = module.get<IGraphicService>(TYPES.GraphicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(graphicService).toBeDefined();
  });

  it('should be able to getGeneralGraphicData', async () => {
    jest
      .spyOn(graphicService, 'generalGraphic')
      .mockResolvedValue(new GeneralGraphicResponseDTO());

    const data = await controller.getGeneralGraphicData(fakeUserPayloadDto);
    expect(data).toBeDefined();
  });
});
