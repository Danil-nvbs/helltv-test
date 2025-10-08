import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { BalanceHistory } from './entities/balance-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
  imports: [TypeOrmModule.forFeature([BalanceHistory]), UsersModule],
  exports: [BalanceService, TypeOrmModule.forFeature([BalanceHistory])],
})
export class BalanceModule {}
