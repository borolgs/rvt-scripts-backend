import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser, UserRole } from './user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('api/v1/users')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(): Promise<IUser[]> {
    return this.usersService.findAll();
  }
}
