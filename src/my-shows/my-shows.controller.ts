import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { TvShowDatabase } from '../models/database.model';
import { IncludeEnded } from '../models/includeEnded.model';
import { MyShowsService } from './my-shows.service';

@Controller('my-shows')
export class MyShowsController {
    constructor(private readonly myShowsService: MyShowsService) { }

    @Get('shows')
    @ApiOkResponse({ type: [TvShowDatabase] })
    @ApiQuery({ name: 'includeEnded', enum: IncludeEnded, required: false })
    async getShows(@Query('includeEnded') includeEnded: IncludeEnded = IncludeEnded.False): Promise<TvShowDatabase[]> {
        const shouldIncludeEnded = includeEnded === IncludeEnded.True;
        return await this.myShowsService.getShows(shouldIncludeEnded);
    }

    @Post('shows/:name')
    async postShow(@Param('name') name: String): Promise<void> {
        return await this.myShowsService.postShow(name);
    }

    @Delete('shows/:id')
    async deleteShow(@Param('id') id: String): Promise<void> {
        return await this.myShowsService.deleteShow(id);
    }
}
