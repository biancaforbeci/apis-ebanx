import { Module } from '@nestjs/common';
import { AccountUseCase } from './application/usecase/account.usecase';
import { AccountController } from './adapters/in/api/account.controller.adapter';


@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountUseCase],
})
export class AppModule {}
