import { Injectable } from '@nestjs/common';
import { Account } from '../domain/account.interface';
import AccountInputPort from '../ports/in/account-input.port';


@Injectable()
export class AccountUseCase implements AccountInputPort {
  private accounts: Map<string, Account> = new Map();

  reset(): void {
    this.accounts.clear();
  }

  getBalance(accountId: string): number | null {
    const account = this.accounts.get(accountId);
    return account ? account.balance : null;
  }

  deposit(destination: string, amount: number): Account {
    const account = this.accounts.get(destination) || { id: destination, balance: 0 };
    account.balance += amount;
    this.accounts.set(destination, account);
    return account;
  }

  withdraw(origin: string, amount: number): Account | null {
    const account = this.accounts.get(origin);
    if (!account) return null;
    
    account.balance -= amount;
    this.accounts.set(origin, account);
    return account;
  }

  transfer(origin: string, destination: string, amount: number): { origin: Account, destination: Account } | null {
    const originAccount = this.accounts.get(origin);
    if (!originAccount) return null;

    const destinationAccount = this.accounts.get(destination) || { id: destination, balance: 0 };
    
    originAccount.balance -= amount;
    destinationAccount.balance += amount;
    
    this.accounts.set(origin, originAccount);
    this.accounts.set(destination, destinationAccount);
    
    return { origin: originAccount, destination: destinationAccount };
  }
}