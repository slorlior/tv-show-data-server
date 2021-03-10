import * as faker from "faker";
import { TvShow, TvShowDetailsResponse, TvShowSearchResponse } from "../tv-show.model";
import { EpisodeMock } from "./episode.mock.model";

export class TvShowMock extends TvShow {
    id: Number;

    name: String;

    description: String;

    status: String;

    image_path: String;

    image_thumbnail_path: String;

    genres: String[];

    episodes: EpisodeMock[];

    constructor() {
        super();
        this.id = faker.random.number();
        this.name = faker.random.word();
        this.description = faker.random.words();
        this.status = faker.random.word();
        this.image_path = faker.image.imageUrl();
        this.image_thumbnail_path = faker.image.imageUrl();
        this.genres = faker.random.arrayElements();
        this.episodes = [];
        for (let i = 0; i < faker.random.number(); i++) {
            const episode = new EpisodeMock();
            this.episodes.push(episode);
        }
    }
}

export class TvShowDetailsResponseMock extends TvShowDetailsResponse {
    tvShow: TvShowMock;

    constructor() {
        super();
        this.tvShow = new TvShowMock();
    }
}

export class TvShowSearchResponseMock extends TvShowSearchResponse {
    tv_shows: TvShowMock[];
    constructor() {
        super();
        this.tv_shows = [new TvShowMock()];
    }
}