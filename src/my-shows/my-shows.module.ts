import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyShowsController } from './my-shows.controller';
import { MyShowsService } from './my-shows.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule
    ],
    controllers: [MyShowsController],
    providers: [MyShowsService]
})
export class MyShowsModule { }
