import { HttpModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TvShowResolver } from './tv-show.resolver';
import { TvShowService } from './tv-show.service';

@Module({
    imports: [
        HttpModule,
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            playground: true,
            introspection: true,
            context: ({ req }) => {
                return {
                    request: req,
                };
            },
        })],
    providers: [TvShowResolver, TvShowService]
})
export class TvShowModule { }
