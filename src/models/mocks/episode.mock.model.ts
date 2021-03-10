import * as faker from "faker";
import { Episode } from "../episode.model";

export class EpisodeMock extends Episode {
    season: Number;

    episode: Number;

    name: String;

    air_date: String;

    constructor() {
        super();
        this.season = faker.random.number();
        this.episode = faker.random.number();
        this.name = faker.random.word();
        this.air_date = faker.date.past().toDateString();
    }
}