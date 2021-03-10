import { ApiProperty } from "@nestjs/swagger";

export class TvShowDatabase {
    @ApiProperty({ required: true })
    id: Number;

    @ApiProperty({ required: true })
    name: String;

    @ApiProperty({ required: true })
    status: String;
}