import { HttpModule, Module } from '@nestjs/common';
import { MyShowsController } from './my-shows.controller';
import { MyShowsService } from './my-shows.service';

@Module({
    imports: [HttpModule],
    controllers: [MyShowsController],
    providers: [MyShowsService]
})
export class MyShowsModule { }
