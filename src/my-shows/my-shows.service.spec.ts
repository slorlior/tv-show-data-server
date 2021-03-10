import { BadRequestException, ConflictException, HttpModule, HttpService, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TvShowDatabaseMock } from '../models/mocks/database.mock.model';
import * as faker from "faker";
import { MyShowsService } from './my-shows.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { ENV_MISSING_TV_SHOW_API } from '../env.errors';
import { GIVEN_SHOW_ALREADY_EXISTS, GIVEN_SHOW_DOESNT_EXISTS } from './my-shows.errors';
import { AxiosResponse } from 'axios';
import { TvShowSearchResponseMock } from '../models/mocks/tv-show.mock.model';
import { of } from 'rxjs';
import { TvShowDatabase } from '../models/database.model';

describe('MyShowsService', () => {
    let service: MyShowsService;
    let configService: ConfigService;
    let httpService: HttpService;
    let databaseService: DatabaseService;
    let tvShowDatabase: TvShowDatabaseMock[];
    let httpResponse: AxiosResponse<TvShowSearchResponseMock>;
    let tvShowSearchResponse: TvShowSearchResponseMock;
    let tvShowApi: String;
    let tvName: String;
    let tvId: Number;
    let includeEnded: Boolean = true;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule, DatabaseModule],
            providers: [MyShowsService],
        }).compile();

        service = module.get<MyShowsService>(MyShowsService);
        configService = module.get<ConfigService>(ConfigService);
        httpService = module.get<HttpService>(HttpService);
        databaseService = module.get<DatabaseService>(DatabaseService);

        tvShowDatabase = [];
        for (let i = 0; i < faker.random.number(); i++) {
            tvShowDatabase.push(new TvShowDatabaseMock());
        }

        tvShowSearchResponse = new TvShowSearchResponseMock();
        httpResponse = {
            data: tvShowSearchResponse,
            headers: {},
            config: {},
            status: 200,
            statusText: 'OK',
        };

        jest.spyOn(httpService, 'get').mockImplementation(() => of(httpResponse));

        tvShowApi = faker.internet.url();
        tvName = tvShowDatabase[0].name;
        tvId = tvShowDatabase[0].id;
        createConfingServiceSpy(tvShowApi);

        jest.spyOn(databaseService, 'getAllTvShows').mockImplementation(() => tvShowDatabase);
        jest.spyOn(databaseService, 'getTvShowById').mockImplementation((id) => tvShowDatabase.find((show) => show.id === id));
        jest.spyOn(databaseService, 'addTvShow').mockImplementation();
        jest.spyOn(databaseService, 'deleteTvShowById').mockImplementation();

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
        it('postShow should throw error if missing TV_SHOW_API in .env', async () => {
            tvShowApi = undefined;
            createConfingServiceSpy(tvShowApi);

            await expect(service.postShow(tvName)).rejects.toThrowError(new BadRequestException(ENV_MISSING_TV_SHOW_API));
        });

        it('postShow should throw ServiceUnavailableException if tv show api returned error', async () => {
            const error = new Error(faker.random.words());
            jest.spyOn(httpService, 'get').mockImplementationOnce(() => { throw error })

            await expect(service.postShow(tvName)).rejects.toThrowError(new ServiceUnavailableException(error));
        });

        it('postShow should throw NotFoundException if tv show api returned empty array', async () => {
            httpResponse.data.tv_shows = [];

            jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(httpResponse))

            await expect(service.postShow(tvName)).rejects.toThrowError(new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS));
        });

        it('postShow should throw ConflictException if tv show already exists in the database', async () => {
            jest.spyOn(databaseService, 'getTvShowById').mockImplementationOnce((id) => tvShowSearchResponse.tv_shows.find((show) => show.id === id));

            await expect(service.postShow(tvName)).rejects.toThrowError(new ConflictException(GIVEN_SHOW_ALREADY_EXISTS));
        });

        it('deleteShow should throw NotFoundException if tv show not exists in the database', async () => {
            tvId = faker.random.number();
            await expect(service.deleteShow(tvId)).rejects.toThrowError(new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS));
        });
    });

    describe('success', () => {
        it('getShows should return all tv shows from db', async () => {
            tvShowDatabase.push(new TvShowDatabaseMock("Ended"));
            jest.spyOn(databaseService, 'getAllTvShows').mockImplementationOnce(() => tvShowDatabase)
            await expect(service.getShows(includeEnded)).resolves.toEqual(tvShowDatabase);
        });

        it('getShows should return not return Ended tv shows from db', async () => {
            includeEnded = false;
            jest.spyOn(databaseService, 'getAllTvShows').mockImplementationOnce(() => [...tvShowDatabase, new TvShowDatabaseMock("Ended")])
            await expect(service.getShows(includeEnded)).resolves.toEqual(tvShowDatabase);
        });

        it('postShow should call httpService.get with the currect url with the given tv show name', async () => {
            await service.postShow(tvName);
            expect(httpService.get).toHaveBeenCalledWith(`${tvShowApi}/search?q=${tvName}&page=1`);
        });

        it('postShow should call databaseService.addTvShow with the currect tv show receive from the api', async () => {
            await service.postShow(tvName);
            const tvShowDatabase = new TvShowDatabase();
            const response = httpResponse.data.tv_shows[0];
            tvShowDatabase.id = response.id;
            tvShowDatabase.name = response.name;
            tvShowDatabase.status = response.status;
            expect(databaseService.addTvShow).toHaveBeenCalledWith(tvShowDatabase);
        });

        it('deleteShow should call databaseService.deleteTvShowById with the given id', async () => {
            await service.deleteShow(tvId);
            expect(databaseService.deleteTvShowById).toHaveBeenCalledWith(tvId);
        });
    });
});
