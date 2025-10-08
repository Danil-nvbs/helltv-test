import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DebitBalanceDto } from './dto/debit-balance.dto';
import { CreditBalanceDto } from './dto/credit-balance.dto';
import { BalanceHistory } from './entities/balance-history.entity';
import { GetBalanceHistoryDto } from './dto/get-balance-history.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post(':userId/debit')
  async debitBalance(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(ValidationPipe) debitDto: DebitBalanceDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: BalanceHistory;
  }> {
    const historyEntry = await this.balanceService.debitBalance(
      userId,
      debitDto,
    );

    return {
      success: true,
      message: 'Balance debited successfully',
      data: historyEntry,
    };
  }

  @Post(':userId/credit')
  async creditBalance(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(ValidationPipe) creditDto: CreditBalanceDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: BalanceHistory;
  }> {
    const historyEntry = await this.balanceService.creditBalance(
      userId,
      creditDto,
    );

    return {
      success: true,
      message: 'Balance credited successfully',
      data: historyEntry,
    };
  }

  @Get(':userId/history')
  async getBalanceHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query(ValidationPipe) getBalanceDto: GetBalanceHistoryDto,
  ): Promise<{
    success: boolean;
    data: BalanceHistory[];
  }> {
    const history = await this.balanceService.getBalanceHistory(
      userId,
      getBalanceDto,
    );

    return {
      success: true,
      data: history,
    };
  }
}
