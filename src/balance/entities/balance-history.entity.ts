import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BalanceAction {
  DEBIT = 'debit', // Списание
  CREDIT = 'credit', // Пополнение
}

@Entity('balance_history')
@Index(['userId', 'ts']) // Индекс для быстрого подсчета баланса
export class BalanceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: BalanceAction,
    comment: 'Тип операции: debit (списание) или credit (пополнение)',
  })
  action: BalanceAction;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    comment: 'Сумма операции',
  })
  amount: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Описание операции',
  })
  description: string;

  @CreateDateColumn({ name: 'ts', comment: 'Timestamp операции' })
  ts: Date;

  @ManyToOne(() => User, (user) => user.balanceHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
