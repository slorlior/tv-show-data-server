import { ApiProperty } from "@nestjs/swagger";

export class TvShowDatabase {
    @ApiProperty({ required: true })
    id: number;

    @ApiProperty({ required: true })
    name: string;

    @ApiProperty({ required: true })
    status: string;
}