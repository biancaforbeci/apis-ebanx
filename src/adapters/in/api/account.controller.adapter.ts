import { Controller, Get, Post, Body, Query, HttpCode, HttpException, HttpStatus, UseFilters, Inject } from '@nestjs/common';
import EventRequest from '../request/event.request';
import { NotFoundExceptionFilter } from '../../../infrastructure/exception-filter/not-found.exception.filter';
import AccountInputPort, { ACCOUNT_INPUT_PORT } from '../../../application/ports/in/account-input.port';

  
  @Controller()
  @UseFilters(NotFoundExceptionFilter)
  export class AccountController {
    constructor(
        @Inject(ACCOUNT_INPUT_PORT)
        private readonly accountInputPort: AccountInputPort
    ) {}
  
    @Post('reset')
    @HttpCode(200)
    reset(): string {
      this.accountInputPort.reset();
      return 'OK';
    }
  
    @Get('balance')
    @HttpCode(200)
    getBalance(@Query('account_id') accountId: string): number {
      const balance = this.accountInputPort.getBalance(accountId);
      if (balance === null) {
        throw new Error('');
      }
      return balance;
    }
  
    @Post('event')
    @HttpCode(201)
    handleEvent(@Body() event: EventRequest) {
      switch (event.type) {
        case 'deposit': {
          const account = this.accountInputPort.deposit(event.destination, event.amount);
          return { destination: account };
        }
  
        case 'withdraw': {
          const account = this.accountInputPort.withdraw(event.origin, event.amount);
          if (!account) {
            throw new Error();
          }
          return { origin: account };
        }
  
        case 'transfer': {
          const result = this.accountInputPort.transfer(event.origin, event.destination, event.amount);
          if (!result) {
            throw new Error();
          }
          return result;
        }
  
        default:
          throw new HttpException('Invalid event type', HttpStatus.BAD_REQUEST);
      }
    }
  }  