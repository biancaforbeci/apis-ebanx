import { Test, TestingModule } from '@nestjs/testing';
import { AccountUseCase } from './account.usecase';
import { ACCOUNT_INPUT_PORT } from '../ports/in/account-input.port';

describe('AccountUseCase', () => {
  let accountUseCase: AccountUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ACCOUNT_INPUT_PORT,
          useClass: AccountUseCase
        }
      ],
    }).compile();

    accountUseCase = module.get<AccountUseCase>(ACCOUNT_INPUT_PORT);
  });

  describe('reset', () => {
    it('should clear all accounts', () => {
      accountUseCase.deposit('123', 100);
      accountUseCase.deposit('456', 200);

      accountUseCase.reset();

      expect(accountUseCase.getBalance('123')).toBeNull();
      expect(accountUseCase.getBalance('456')).toBeNull();
    });
  });

  describe('getBalance', () => {
    it('should return null for non-existent account', () => {
      expect(accountUseCase.getBalance('999')).toBeNull();
    });

    it('should return correct balance for existing account', () => {
      accountUseCase.deposit('123', 100);
      expect(accountUseCase.getBalance('123')).toBe(100);
    });
  });

  describe('deposit', () => {
    it('should create new account and deposit amount', () => {
      const result = accountUseCase.deposit('123', 100);

      expect(result.id).toBe('123');
      expect(result.balance).toBe(100);
      expect(accountUseCase.getBalance('123')).toBe(100);
    });

    it('should add amount to existing account', () => {
      accountUseCase.deposit('123', 100);

      const result = accountUseCase.deposit('123', 50);

      expect(result.id).toBe('123');
      expect(result.balance).toBe(150);
      expect(accountUseCase.getBalance('123')).toBe(150);
    });
  });

  describe('withdraw', () => {
    it('should return null for non-existent account', () => {
      expect(accountUseCase.withdraw('999', 100)).toBeNull();
    });

    it('should withdraw amount from existing account', () => {
      accountUseCase.deposit('123', 100);
      const result = accountUseCase.withdraw('123', 50);

      expect(result?.id).toBe('123');
      expect(result?.balance).toBe(50);
      expect(accountUseCase.getBalance('123')).toBe(50);
    });

    it('should allow withdrawing entire balance', () => {
      accountUseCase.deposit('123', 100);

      const result = accountUseCase.withdraw('123', 100);

      expect(result?.id).toBe('123');
      expect(result?.balance).toBe(0);
      expect(accountUseCase.getBalance('123')).toBe(0);
    });
  });

  describe('transfer', () => {
    it('should return null if origin account does not exist', () => {
      expect(accountUseCase.transfer('999', '123', 100)).toBeNull();
    });

    it('should create destination account if it does not exist', () => {
      accountUseCase.deposit('123', 100);

      const result = accountUseCase.transfer('123', '456', 50);

      expect(result).not.toBeNull();
      expect(result?.origin.id).toBe('123');
      expect(result?.origin.balance).toBe(50);
      expect(result?.destination.id).toBe('456');
      expect(result?.destination.balance).toBe(50);
    });

    it('should transfer amount between existing accounts', () => {
      accountUseCase.deposit('123', 100);
      accountUseCase.deposit('456', 50);

      const result = accountUseCase.transfer('123', '456', 30);
      
      expect(result).not.toBeNull();
      expect(result?.origin.id).toBe('123');
      expect(result?.origin.balance).toBe(70);
      expect(result?.destination.id).toBe('456');
      expect(result?.destination.balance).toBe(80);
    });
  });
}); 