import { Test, TestingModule } from '@nestjs/testing';
import { MyShowsController } from './my-shows.controller';

describe('MyShowsController', () => {
  let controller: MyShowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyShowsController],
    }).compile();

    controller = module.get<MyShowsController>(MyShowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
