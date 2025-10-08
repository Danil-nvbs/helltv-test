import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(): Promise<User> {
    const user = this.userRepository.create();
    return await this.userRepository.save(user);
  }

  async getUsers(dto: GetUsersDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { id: MoreThan(dto.lastId || 0) },
      take: dto.take,
      order: { id: 'ASC' },
    });
    return users;
  }

  async getUserById(id: number): Promise<User> {
    // const cacheKey = `user:${userId}`;
    // const cached = await this.cacheManager.get<User>(cacheKey);

    // if (cached) {
    // return cached;
    // }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `Can't find user with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // await this.cacheManager.set(cacheKey, user, 600); // 10 минут

    return user;
  }

  async getUserBalance(
    userId: number,
  ): Promise<{ userId: number; balance: number }> {
    const user = await this.getUserById(userId);

    return {
      userId: user.id,
      balance: parseFloat(user.balance.toString()),
    };
  }
}
