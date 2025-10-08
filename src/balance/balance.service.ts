import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, MoreThan } from 'typeorm';
import {
  BalanceHistory,
  BalanceAction,
} from './entities/balance-history.entity';
import { User } from '../users/entities/user.entity';
import { CreditBalanceDto } from './dto/credit-balance.dto';
import { DebitBalanceDto } from './dto/debit-balance.dto';
import { GetBalanceHistoryDto } from './dto/get-balance-history.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceHistory)
    private balanceHistoryRepository: Repository<BalanceHistory>,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async debitBalance(
    userId: number,
    debitDto: DebitBalanceDto,
  ): Promise<BalanceHistory> {
    return await this.dataSource.transaction(async (transaction) => {
      const user = await transaction.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const currentBalance = await this.recalculateBalanceFromHistory(
        userId,
        transaction,
      );

      if (currentBalance < debitDto.amount) {
        throw new HttpException('Insufficient balance', HttpStatus.CONFLICT);
      }

      const history = transaction.create(BalanceHistory, {
        userId,
        action: BalanceAction.DEBIT,
        amount: debitDto.amount,
        description: debitDto.description,
      });
      await transaction.save(history);

      user.balance = currentBalance - debitDto.amount;
      await transaction.save(user);

      await this.refreshUserBalanceCache(userId, user.balance);

      return history;
    });
  }

  async creditBalance(userId: number, creditDto: CreditBalanceDto) {
    return await this.dataSource.transaction(async (transaction) => {
      const user = await transaction.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const currentBalance = await this.recalculateBalanceFromHistory(
        userId,
        transaction,
      );

      const history = transaction.create(BalanceHistory, {
        userId,
        action: BalanceAction.CREDIT,
        amount: creditDto.amount,
        description: creditDto.description,
      });
      await transaction.save(history);

      user.balance = currentBalance + creditDto.amount;
      await transaction.save(user);

      await this.refreshUserBalanceCache(userId, user.balance);

      return history;
    });
  }

  async getBalanceHistory(
    userId: number,
    getBalanceDto: GetBalanceHistoryDto,
  ): Promise<BalanceHistory[]> {
    const history = await this.balanceHistoryRepository.find({
      where: { userId, id: MoreThan(getBalanceDto.lastId) },
      order: { ts: 'DESC' },
      take: getBalanceDto.take,
    });

    return history;
  }

  private async recalculateBalanceFromHistory(
    userId: number,
    transaction: EntityManager,
  ): Promise<number> {
    const result = (await transaction
      .createQueryBuilder(BalanceHistory, 'bh')
      .select(
        `
        COALESCE(
          SUM(CASE WHEN bh.action = 'credit' THEN bh.amount ELSE 0 END) -
          SUM(CASE WHEN bh.action = 'debit' THEN bh.amount ELSE 0 END),
          0
        )`,
        'balance',
      )
      .where('bh.userId = :userId', { userId })
      .getRawOne()) as { balance: string };
    return parseFloat(result.balance) || 0;
  }

  private async refreshUserBalanceCache(
    userId: number,
    newBalance: number,
  ): Promise<void> {
    const key = `user:${userId}:balance`;
    await this.cacheManager.del(key);
    await this.cacheManager.set(key, newBalance, 600);
  }
}
