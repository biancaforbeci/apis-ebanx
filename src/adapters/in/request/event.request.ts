import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export default class EventRequest {
  @IsNotEmpty()
  @IsString()
  public readonly type: 'deposit' | 'withdraw' | 'transfer';

  @IsNotEmpty()
  @IsString()
  public readonly destination?: string;

  @IsNotEmpty()
  @IsString()
  public readonly origin?: string;

  @IsNotEmpty()
  @IsNumber()
  public readonly amount: number;
}
