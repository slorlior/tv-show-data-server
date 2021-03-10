import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
    @Field(type => Int)
    season: Number;

    @Field(type => Int)
    episode: Number;

    @Field()
    name: String;

    @Field()
    air_date: String;
}