import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.model';

@ObjectType()
export class TvShow {
    @Field(type => Int)
    id: Number;

    @Field()
    name: String;

    @Field()
    description: String;

    @Field()
    status: String;

    @Field()
    image_path: String;

    @Field()
    image_thumbnail_path: String;

    @Field(type => [String])
    genres: String[];

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