import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { IncludeEnded } from 'src/models/includeEnded.model';
import { MyShowsService } from './my-shows.service';

@Controller('my-shows')
export class MyShowsController {
    constructor(private readonly myShowsService: MyShowsService) { }

    @Get('shows')
    @ApiOkResponse({ type: String })
    @ApiQuery({ name: 'includeEnded', enum: IncludeEnded, required: false })
    async getShows(@Query('includeEnded') includeEnded: IncludeEnded = IncludeEnded.False) {
        return await this.myShowsService.getShows(includeEnded);
    }

    @Post('shows/:name')
    @ApiOkResponse({ type: String })
    async postShow(@Param('name') name: String): Promise<void> {
        return await this.myShowsService.postShow(name);
    }

    @Delete('shows/:id')
    @ApiOkResponse({ type: String })
    async deleteShow(@Param('id') id: String): Promise<void> {
        return await this.myShowsService.deleteShow(id);
    }
}
