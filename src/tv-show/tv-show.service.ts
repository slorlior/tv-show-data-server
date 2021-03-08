import { BadRequestException, HttpService, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { ENV_MISSING_TV_SHOW_API } from '../env.errors';
import { TvShow, TvShowDetailsResponse } from '../models/tv-show.model';
import { GIVEN_TV_SHOW_ID_NOT_FOUND } from './tv-show.errors';

@Injectable()
export class TvShowService {
    constructor(private configService: ConfigService, private httpService: HttpService) { }

    async getTvShow(id: String): Promise<TvShow> {
        const tvShowApi = this.configService.get<String>("TV_SHOW_API");
        if (!tvShowApi) {
            throw new BadRequestException(ENV_MISSING_TV_SHOW_API);
        }

        let tvShowDetailsResponse;
        try {
            tvShowDetailsResponse = (await this.httpService.get(`${tvShowApi}/show-details?q=${id}`).toPromise<AxiosResponse<TvShowDetailsResponse>>()).data;
        } catch (error) {
            throw new ServiceUnavailableException(error);
        }

        if (!tvShowDetailsResponse.tvShow || !tvShowDetailsResponse.tvShow.id) {
            throw new NotFoundException(GIVEN_TV_SHOW_ID_NOT_FOUND);
        }
        return tvShowDetailsResponse.tvShow;
    }
}
