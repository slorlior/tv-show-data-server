import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { TvShow, TvShowDetailsResponse } from 'src/models/tv-show.model';

@Injectable()
export class TvShowService {
    constructor(private httpService: HttpService) { }

    async getTvShow(id: String): Promise<TvShow> {
        return (await this.httpService.get(`https://www.episodate.com/api/show-details?q=${id}`).toPromise<AxiosResponse<TvShowDetailsResponse>>()).data.tvShow;
    }
}
