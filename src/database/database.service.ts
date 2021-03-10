import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { TvShowDatabase } from '../models/database.model';
import { DATABASE_PATH } from './database.consts';

@Injectable()
export class DatabaseService {
    constructor() {
        if (!fs.existsSync(DATABASE_PATH)) {
            fs.writeFileSync(DATABASE_PATH, JSON.stringify([]));
        }
    }

    getAllTvShows(): TvShowDatabase[] {
        return JSON.parse(fs.readFileSync(DATABASE_PATH).toString());
    }

    getTvShowById(id: Number): TvShowDatabase | undefined {
        return this.getAllTvShows().find(show => show.id === id)
    }

    addTvShow(tvShow: TvShowDatabase) {
        const tvShows = this.getAllTvShows();
        tvShows.push(tvShow);
        fs.writeFileSync(DATABASE_PATH, JSON.stringify(tvShows));
    }

    deleteTvShowById(id: Number) {
        let tvShows = this.getAllTvShows();
        tvShows = tvShows.filter((tvShow) => tvShow.id !== id);
        fs.writeFileSync(DATABASE_PATH, JSON.stringify(tvShows));
    }
}
