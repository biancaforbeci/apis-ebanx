import { Module } from '@nestjs/common';
import { AccountUseCase } from './application/usecase/account.usecase';
import { AccountController } from './adapters/in/api/account.controller.adapter';
import { ACCOUNT_INPUT_PORT } from './application/ports/in/account-input.port';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    {
      provide: ACCOUNT_INPUT_PORT,
      useClass: AccountUseCase
    }
  ],
})
export class AppModule {}
