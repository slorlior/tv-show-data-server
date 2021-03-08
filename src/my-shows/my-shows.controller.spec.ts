import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MyShowsController } from './my-shows.controller';
import { MyShowsService } from './my-shows.service';

describe('MyShowsController', () => {
    let controller: MyShowsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule],
            controllers: [MyShowsController],
            providers: [MyShowsService]
        }).compile();

        controller = module.get<MyShowsController>(MyShowsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
