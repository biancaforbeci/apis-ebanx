import { Account } from "../../domain/account.interface";

export const ACCOUNT_INPUT_PORT = 'ACCOUNT_INPUT_PORT';

export default interface AccountInputPort {
    reset(): void;
    getBalance(accountId: string): number | null;
    deposit(destination: string, amount: number): Account;
    withdraw(origin: string, amount: number): Account | null;
    transfer(origin: string, destination: string, amount: number): { origin: Account, destination: Account } | null;
}
