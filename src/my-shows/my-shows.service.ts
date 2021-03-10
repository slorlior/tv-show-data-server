import { BadRequestException, ConflictException, HttpService, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { TvShowDatabase } from '../models/database.model';
import { ENV_MISSING_TV_SHOW_API } from '../env.errors';
import { TvShowSearchResponse } from '../models/tv-show.model';
import { GIVEN_SHOW_ALREADY_EXISTS, GIVEN_SHOW_DOESNT_EXISTS } from './my-shows.errors';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MyShowsService {

    constructor(private configService: ConfigService,
        private httpService: HttpService,
        private databaseService: DatabaseService) {
    }

    async getShows(includeEnded: Boolean): Promise<TvShowDatabase[]> {
        const tvShows: TvShowDatabase[] = await this.databaseService.getAllTvShows();
        if (!includeEnded) {
            return tvShows.filter(show => show.status !== 'Ended');
        }
        return tvShows;

    }

    async postShow(name: String): Promise<void> {
        const tvShowApi = this.configService.get<String>("TV_SHOW_API");
        if (!tvShowApi) {
            throw new BadRequestException(ENV_MISSING_TV_SHOW_API);
        }
        let tvShowsFound;
        try {
            tvShowsFound = (await this.httpService.get(`${tvShowApi}/search?q=${name}&page=1`).toPromise<AxiosResponse<TvShowSearchResponse>>()).data.tv_shows;
        } catch (error) {
            throw new ServiceUnavailableException(error);
        }
        if (tvShowsFound.length == 0) {
            throw new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS);
        }
        const tvShow = tvShowsFound[0];
        if (this.databaseService.getTvShowById(tvShow.id)) {
            throw new ConflictException(GIVEN_SHOW_ALREADY_EXISTS);
        }
        const tvShowDatabase = new TvShowDatabase();
        tvShowDatabase.id = tvShow.id;
        tvShowDatabase.name = tvShow.name;
        tvShowDatabase.status = tvShow.status;
        this.databaseService.addTvShow(tvShowDatabase);
    }

    async deleteShow(id: Number): Promise<void> {
        if (!this.databaseService.getTvShowById(id)) {
            throw new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS)
        }
        this.databaseService.deleteTvShowById(id);
    }
}
