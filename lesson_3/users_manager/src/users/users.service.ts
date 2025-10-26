import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];

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

    return newUser;
  }

  onModuleInit() {
    console.log('UsersService initialized');
  }
}
