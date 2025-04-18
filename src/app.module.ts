import { Module } from '@nestjs/common';
import { AppController } from './adapters/in/api/app.controller.adapter';
import { AccountUseCase } from './application/usecase/account.usecase';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AccountUseCase],
})
export class AppModule {}
