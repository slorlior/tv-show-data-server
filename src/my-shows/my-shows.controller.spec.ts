import { BadRequestException, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from "faker";
import { TvShowDatabaseMock } from '../models/mocks/database.mock.model';
import { DatabaseModule } from '../database/database.module';
import { MyShowsController } from './my-shows.controller';
import { ID_IS_NAN } from './my-shows.errors';
import { MyShowsService } from './my-shows.service';
import { IncludeEnded } from '../models/includeEnded.model';

describe('MyShowsController', () => {
    let controller: MyShowsController;
    let myShowsService: MyShowsService;
    let idString: String;
    let idNumber: Number;
    let tvShows: TvShowDatabaseMock[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot(), HttpModule, DatabaseModule],
            controllers: [MyShowsController],
            providers: [MyShowsService]
        }).compile();

        controller = module.get<MyShowsController>(MyShowsController);
        myShowsService = module.get<MyShowsService>(MyShowsService);

        tvShows = [new TvShowDatabaseMock()];

        jest.spyOn(myShowsService, 'getShows').mockResolvedValue(tvShows);
        jest.spyOn(myShowsService, 'postShow').mockImplementation();
        jest.spyOn(myShowsService, 'deleteShow').mockImplementation();

        idNumber = faker.random.number();
        idString = idNumber.toString();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('getShows should call myShowsService.getShows with default includeEnded=false', async () => {
        await controller.getShows();
        expect(myShowsService.getShows).toHaveBeenCalledWith(false);
    });

    it('getShows should call myShowsService.getShows with given includeEnded', async () => {
        const bool = faker.random.boolean();
        let includeEnded;
        if (bool) {
            includeEnded = IncludeEnded.True;
        }
        else {
            includeEnded = IncludeEnded.False
        }
        await controller.getShows(includeEnded);
        expect(myShowsService.getShows).toHaveBeenCalledWith(bool);
    });

    it('postShow should call myShowsService.postShow with given name', async () => {
        const name = faker.random.word();
        await controller.postShow(name);
        expect(myShowsService.postShow).toHaveBeenCalledWith(name);
    });

    it('deleteShow should throw BadRequestException on NaN id', async () => {
        await expect(controller.deleteShow(faker.random.word())).rejects.toThrowError(new BadRequestException(ID_IS_NAN));
    });

    it('deleteShow should call myShowsService.deleteShow with given id parsed to number', async () => {
        await controller.deleteShow(idString);
        expect(myShowsService.deleteShow).toHaveBeenCalledWith(idNumber);
    });
});
