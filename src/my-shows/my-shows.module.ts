import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { MyShowsController } from './my-shows.controller';
import { MyShowsService } from './my-shows.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        HttpModule,
        DatabaseModule
    ],
    controllers: [MyShowsController],
    providers: [MyShowsService]
})
export class MyShowsModule { }
