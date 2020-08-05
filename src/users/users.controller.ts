import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('api/v1/users')
  findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }
}
