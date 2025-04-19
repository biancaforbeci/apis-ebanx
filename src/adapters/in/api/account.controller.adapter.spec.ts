import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller.adapter';
import { HttpException, HttpStatus } from '@nestjs/common';
import EventRequest from '../request/event.request';
import { AccountUseCase } from '../../../application/usecase/account.usecase';

describe('AccountController', () => {
  let controller: AccountController;
  let accountUseCase: AccountUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountUseCase,
          useValue: {
            reset: jest.fn(),
            getBalance: jest.fn(),
            deposit: jest.fn(),
            withdraw: jest.fn(),
            transfer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    accountUseCase = module.get<AccountUseCase>(AccountUseCase);
  });

  describe('reset', () => {
    it('should call reset and return OK', () => {
      const result = controller.reset();
      expect(accountUseCase.reset).toHaveBeenCalled();
      expect(result).toBe('OK');
    });
  });

  describe('getBalance', () => {
    it('should return balance when account exists', () => {
      const accountId = '123';
      const balance = 100;
      (accountUseCase.getBalance as jest.Mock).mockReturnValue(balance);
      const result = controller.getBalance(accountId);

      expect(accountUseCase.getBalance).toHaveBeenCalledWith(accountId);
      expect(result).toBe(balance);
    });

    it('should throw NOT_FOUND when account does not exist', () => {
      const accountId = '999';
      (accountUseCase.getBalance as jest.Mock).mockReturnValue(null);

      expect(() => controller.getBalance(accountId)).toThrow(
        new HttpException('0', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('handleEvent', () => {
    describe('deposit', () => {
      it('should handle deposit event correctly', () => {
        const event: EventRequest = {
          type: 'deposit',
          destination: '123',
          amount: 100,
        };
        const mockAccount = { id: '123', balance: 100 };
        (accountUseCase.deposit as jest.Mock).mockReturnValue(mockAccount);

        const result = controller.handleEvent(event);
        expect(accountUseCase.deposit).toHaveBeenCalledWith(event.destination, event.amount);
        expect(result).toEqual({ destination: mockAccount });
      });
    });

    describe('withdraw', () => {
      it('should handle withdraw event correctly', () => {
        const event: EventRequest = {
          type: 'withdraw',
          origin: '123',
          amount: 50,
        };
        const mockAccount = { id: '123', balance: 50 };
        (accountUseCase.withdraw as jest.Mock).mockReturnValue(mockAccount);

        const result = controller.handleEvent(event);

        expect(accountUseCase.withdraw).toHaveBeenCalledWith(event.origin, event.amount);
        expect(result).toEqual({ origin: mockAccount });
      });

      it('should throw NOT_FOUND when account does not exist', () => {
        const event: EventRequest = {
          type: 'withdraw',
          origin: '999',
          amount: 50,
        };
        (accountUseCase.withdraw as jest.Mock).mockReturnValue(null);
        expect(() => controller.handleEvent(event)).toThrow(
          new HttpException('0', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('transfer', () => {
      it('should handle transfer event correctly', () => {
        const event: EventRequest = {
          type: 'transfer',
          origin: '123',
          destination: '456',
          amount: 30,
        };
        const mockResult = {
          origin: { id: '123', balance: 70 },
          destination: { id: '456', balance: 30 },
        };
        (accountUseCase.transfer as jest.Mock).mockReturnValue(mockResult);

        const result = controller.handleEvent(event);

        expect(accountUseCase.transfer).toHaveBeenCalledWith(
          event.origin,
          event.destination,
          event.amount,
        );
        expect(result).toEqual(mockResult);
      });

      it('should throw NOT_FOUND when origin account does not exist', () => {
        const event: EventRequest = {
          type: 'transfer',
          origin: '999',
          destination: '456',
          amount: 30,
        };
        (accountUseCase.transfer as jest.Mock).mockReturnValue(null);

        expect(() => controller.handleEvent(event)).toThrow(
          new HttpException('0', HttpStatus.NOT_FOUND),
        );
      });
    });

    it('should throw BAD_REQUEST for invalid event type', () => {
      const event = {
        type: 'invalid' as any,
        amount: 100,
      } as EventRequest;

      expect(() => controller.handleEvent(event)).toThrow(
        new HttpException('Invalid event type', HttpStatus.BAD_REQUEST),
      );
    });
  });
}); 