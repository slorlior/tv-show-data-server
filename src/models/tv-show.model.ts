import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.model';

@ObjectType()
export class TvShow {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    status: string;

    @Field()
    image_path: string;

    @Field()
    image_thumbnail_path: string;

    @Field(type => [String])
    genres: string[];

    @Field(type => [Episode])
    episodes: Episode[];
}

@ObjectType()
export class TvShowDetailsResponse {
    tvShow: TvShow;
}

@ObjectType()
export class TvShowSearchResponse {
    tv_shows: TvShow[];
}