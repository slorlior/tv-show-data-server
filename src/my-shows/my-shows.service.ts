import { BadRequestException, ConflictException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { TvShowDatabase } from '../models/database.model';
import { DATABASE_NAME, DATABASE_PATH } from '../database/database.consts';
import { ENV_MISSING_TV_SHOW_API } from '../env.errors';
import { TvShowSearchResponse } from '../models/tv-show.model';
import { GIVEN_SHOW_ALREADY_EXISTS, GIVEN_SHOW_DOESNT_EXISTS } from './my-shows.errors';
const StormDB = require("stormdb");

@Injectable()
export class MyShowsService {
    private db;
    constructor(private configService: ConfigService, private httpService: HttpService) {
        const engine = new StormDB.localFileEngine(DATABASE_PATH, { async: true });
        this.db = new StormDB(engine);
        this.db.default({ tvshows: [] });
    }

    async getShows(includeEnded: Boolean): Promise<TvShowDatabase[]> {
        const tvShows: TvShowDatabase[] = this.db.get(DATABASE_NAME).value();
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
        const tvShowsFound = (await this.httpService.get(`${tvShowApi}/search?q=${name}&page=1`).toPromise<AxiosResponse<TvShowSearchResponse>>()).data.tv_shows;
        if (tvShowsFound.length == 0) {
            throw new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS)
        }
        const tvShow = tvShowsFound[0];
        if (this.db.get(DATABASE_NAME).value().find(show => show.id === tvShow.id)) {
            throw new ConflictException(GIVEN_SHOW_ALREADY_EXISTS)
        }
        this.db.get(DATABASE_NAME).push({ id: tvShow.id, name: tvShow.name, status: tvShow.status });
        await this.db.save();
    }

    async deleteShow(id: String): Promise<void> {
        if (!this.db.get(DATABASE_NAME).value().find(show => show.id == id)) {
            throw new NotFoundException(GIVEN_SHOW_DOESNT_EXISTS)
        }
        this.db.get(DATABASE_NAME).filter(show => show.id != id);
        await this.db.save();
    }
}
