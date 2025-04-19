import { Controller, Get, Post, Body, Query, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { AccountUseCase } from '../../../application/usecase/account.usecase';
import EventRequest from '../request/event.request';
  
  @Controller()
  export class AccountController {
    constructor(private readonly accountUseCase: AccountUseCase) {}
  
    @Post('reset')
    @HttpCode(200)
    reset(): string {
      this.accountUseCase.reset();
      return 'OK';
    }
  
    @Get('balance')
    getBalance(@Query('account_id') accountId: string): number {
      const balance = this.accountUseCase.getBalance(accountId);
      if (balance === null) {
        throw new HttpException('0', HttpStatus.NOT_FOUND);
      }
      return balance;
    }
  
    @Post('event')
    @HttpCode(201)
    handleEvent(@Body() event: EventRequest) {
      switch (event.type) {
        case 'deposit': {
          const account = this.accountUseCase.deposit(event.destination, event.amount);
          return { destination: account };
        }
  
        case 'withdraw': {
          const account = this.accountUseCase.withdraw(event.origin, event.amount);
          if (!account) {
            throw new HttpException('0', HttpStatus.NOT_FOUND);
          }
          return { origin: account };
        }
  
        case 'transfer': {
          const result = this.accountUseCase.transfer(event.origin, event.destination, event.amount);
          if (!result) {
            throw new HttpException('0', HttpStatus.NOT_FOUND);
          }
          return result;
        }
  
        default:
          throw new HttpException('Invalid event type', HttpStatus.BAD_REQUEST);
      }
    }
  }  