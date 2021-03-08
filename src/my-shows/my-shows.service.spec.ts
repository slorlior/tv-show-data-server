import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MyShowsService } from './my-shows.service';

describe('MyShowsService', () => {
    let service: MyShowsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule],
            providers: [MyShowsService],
        }).compile();

        service = module.get<MyShowsService>(MyShowsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
