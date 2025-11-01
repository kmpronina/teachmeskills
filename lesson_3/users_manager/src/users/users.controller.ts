import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.users.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.users.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: Partial<CreateUserDto>,
  ) {
    return this.users.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    this.users.delete(id);
  }
}
