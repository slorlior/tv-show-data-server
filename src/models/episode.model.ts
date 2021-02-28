import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
    @Field(type => Int)
    season: number;

    @Field(type => Int)
    episode: number;

    @Field()
    name: String;

    @Field()
    air_date: String;
}