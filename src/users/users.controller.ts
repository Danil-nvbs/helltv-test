import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersDto } from './dto/get-users.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create() {
    return await this.usersService.createUser();
  }

  @Get()
  async getUsers(
    @Query(ValidationPipe) getUsersDto: GetUsersDto,
  ): Promise<User[]> {
    return await this.usersService.getUsers(getUsersDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUserById(+id);
  }
}
