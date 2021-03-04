import { Args, Query, Resolver } from '@nestjs/graphql';
import { TvShow } from '../models/tv-show.model';
import { TvShowService } from './tv-show.service';

@Resolver(of => TvShow)
export class TvShowResolver {
    constructor(private tvShowService: TvShowService) { }

    @Query(returns => TvShow)
    async tvShow(@Args('id', { type: () => String }) id: String): Promise<TvShow> {
        return await this.tvShowService.getTvShow(id);
    }
}
