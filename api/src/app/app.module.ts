import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://' + process.env.MONGODB_HOST ||
        'localhost' + ':' + process.env.MONGODB_PORT ||
        '27017' + '/' + process.env.MONGODB_DATABASE ||
        'dev',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
