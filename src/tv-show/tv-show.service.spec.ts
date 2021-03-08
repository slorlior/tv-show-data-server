import { BadRequestException, HttpModule, HttpService, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import * as faker from "faker";
import { AxiosResponse } from 'axios';
import { TvShowService } from './tv-show.service';
import { ENV_MISSING_TV_SHOW_API } from '../env.errors';
import { GIVEN_TV_SHOW_ID_NOT_FOUND } from './tv-show.errors';
import { TvShowDetailsResponseMock } from '../models/mocks/tv-show.mock.model';

describe('TvShowDataService', () => {
    let service: TvShowService;
    let configService: ConfigService;
    let httpService: HttpService;
    let httpResponse: AxiosResponse<TvShowDetailsResponseMock>;
    let tvShow: TvShowDetailsResponseMock;
    let id: String;
    let tvShowApi: String;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule],
            providers: [TvShowService],
        }).compile();

        service = module.get<TvShowService>(TvShowService);
        configService = module.get<ConfigService>(ConfigService);
        httpService = module.get<HttpService>(HttpService);

        tvShow = new TvShowDetailsResponseMock();

        httpResponse = {
            data: tvShow,
            headers: {},
            config: {},
            status: 200,
            statusText: 'OK',
        };

        jest.spyOn(httpService, 'get').mockImplementation(() => of(httpResponse));

        id = faker.random.uuid();
        tvShowApi = faker.internet.url();
        createConfingServiceSpy(tvShowApi);

    });

    function createConfingServiceSpy(tvShowApi) {
        jest.spyOn(configService, 'get').mockImplementation((param) => {
            switch (param) {
                case 'TV_SHOW_API':
                    return tvShowApi;
                default:
                    return param;
            }
        });
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('errors', () => {
        it('getTvShow should throw error if missing TV_SHOW_API in .env', async () => {
            tvShowApi = undefined;
            createConfingServiceSpy(tvShowApi);

            await expect(service.getTvShow(id)).rejects.toThrowError(new BadRequestException(ENV_MISSING_TV_SHOW_API));
        });

        it('getTvShow should throw ServiceUnavailableException if tv show api returned error', async () => {
            const error = new Error(faker.random.words());
            jest.spyOn(httpService, 'get').mockImplementationOnce(() => { throw error })

            await expect(service.getTvShow(id)).rejects.toThrowError(new ServiceUnavailableException(error));
        });

        it('getTvShow should throw NotFoundException if tv show api returned no tv show for given query (tvShow undefined)', async () => {
            httpResponse.data.tvShow = undefined;
            jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(httpResponse))
            await expect(service.getTvShow(id)).rejects.toThrowError(new NotFoundException(GIVEN_TV_SHOW_ID_NOT_FOUND));
        });

        it('getTvShow should throw NotFoundException if tv show api returned no tv show for given query (tvShow.id undefined)', async () => {
            httpResponse.data.tvShow.id = undefined;
            jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(httpResponse))
            await expect(service.getTvShow(id)).rejects.toThrowError(new NotFoundException(GIVEN_TV_SHOW_ID_NOT_FOUND));
        });
    });

    describe('success', () => {
        it('getTvShow should return tv show details for valid given id', async () => {
            await expect(service.getTvShow(id)).resolves.toEqual(tvShow.tvShow);
        });
    });

});
