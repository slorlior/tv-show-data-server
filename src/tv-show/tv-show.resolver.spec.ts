import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from "faker";
import { TvShowResolver } from './tv-show.resolver';
import { TvShowService } from './tv-show.service';
import { TvShowMock } from '../models/mocks/tv-show.mock.model';

describe('TvShowDataResolver', () => {
    let resolver: TvShowResolver;
    let tvShowService: TvShowService;
    let id: String;
    let tvShow: TvShowMock;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule],
            providers: [TvShowResolver, TvShowService],
        }).compile();

        resolver = module.get<TvShowResolver>(TvShowResolver);
        tvShowService = module.get<TvShowService>(TvShowService);

        tvShow = new TvShowMock();

        jest.spyOn(tvShowService, 'getTvShow').mockResolvedValue(tvShow);

        id = faker.random.uuid();
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('tvShow should call tvShowService.getTvShow with given id', async () => {
        await resolver.tvShow(id);
        expect(tvShowService.getTvShow).toHaveBeenCalledWith(id);
    });

    it('tvShow should return tvShowService.getTvShow result', async () => {
        expect(await resolver.tvShow(id)).toEqual(tvShow);
    });
});
