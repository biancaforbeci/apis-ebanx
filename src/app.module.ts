import { Module } from '@nestjs/common';
import { AppController } from './adapters/in/api/app.controller.adapter';
import { AppUseCase } from './application/usecase/account.usecase';



@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppUseCase],
})
export class AppModule {}
