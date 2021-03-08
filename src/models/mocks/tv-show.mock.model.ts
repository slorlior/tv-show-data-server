import * as faker from "faker";
import { TvShow, TvShowDetailsResponse } from "../tv-show.model";
import { EpisodeMock } from "./episode.mock.model";

export class TvShowMock extends TvShow {
    id: number;

    name: string;

    description: string;

    status: string;

    image_path: string;

    image_thumbnail_path: string;

    genres: string[];

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