import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];

  constructor(private readonly logger: LoggerService) {}

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      createdAt: new Date(),
    };

    this.users.push(newUser);

    this.logger.info(`User was created: ${newUser.name} (${newUser.email})`);

    return newUser;
  }

  delete(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.users.splice(index, 1);

    this.logger.warn(`User with id ${id} was deleted`);
  }

  update(id: string, dto: Partial<CreateUserDto>): User {
    const user = this.findOne(id);

    if (dto.name) {
      user.name = dto.name;
    }
    if (dto.email) {
      user.email = dto.email;
    }

    this.logger.info(`User with id ${id} was updated`);

    return user;
  }

  onModuleInit() {
    console.log('UsersService initialized');
  }
}
