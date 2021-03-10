import * as faker from "faker";
import { TvShowDatabase } from "../database.model";

export class TvShowDatabaseMock extends TvShowDatabase {
    id: Number;

    name: String;

    status: String;

    constructor(status: String = faker.random.word()) {
        super();
        this.id = faker.random.number();
        this.name = faker.random.word();
        this.status = status;
    }
}