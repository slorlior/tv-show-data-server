import { Module } from '@nestjs/common';
import { TvShowModule } from './tv-show/tv-show.module';
import { MyShowsModule } from './my-shows/my-shows.module';

@Module({
	imports: [
		TvShowModule,
		MyShowsModule
	]
})
export class ApplicationModule { }
