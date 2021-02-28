import { ConflictException, HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { TvShowSearchResponse } from 'src/models/tv-show.model';
const StormDB = require("stormdb");


@Injectable()
export class MyShowsService {
    private db;
    constructor(private httpService: HttpService) {
        const engine = new StormDB.localFileEngine("src/database/tvshows.stormdb", { async: true });
        this.db = new StormDB(engine);
        this.db.default({ tvshows: [] });
    }

    async getShows(includeEnded: String) {
        const tvShows = this.db.get("tvshows").value();
        if (includeEnded === 'false') {
            return tvShows.filter(show => show.status !== 'Ended');
        }
        return tvShows;

    }

    async postShow(name: String): Promise<void> {
        const tvShowsFound = (await this.httpService.get(`https://www.episodate.com/api/search?q=${name}&page=1`).toPromise<AxiosResponse<TvShowSearchResponse>>()).data.tv_shows;
        if (tvShowsFound.length == 0) {
            throw new NotFoundException("Given show doesn't exists")
        }
        const tvShow = tvShowsFound[0];
        if (this.db.get("tvshows").value().find(show => show.id === tvShow.id)) {
            throw new ConflictException("Given show already exists")
        }
        this.db.get("tvshows").push({ id: tvShow.id, name: tvShow.name, status: tvShow.status });
        await this.db.save();
    }

    async deleteShow(id: String): Promise<void> {
        this.db.get("tvshows").filter(show => show.id != id);
        if (!this.db.get("tvshows").value().find(show => show.id === id)) {
            throw new NotFoundException("Given show doesn't exists")
        }
        await this.db.save();
    }
}
