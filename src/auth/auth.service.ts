import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      console.log(user.matchPassword);

      const matchResult = await user.matchPassword(pass);
      if (matchResult) {
        return user;
      }
    }
    return null;
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new ForbiddenException('Email already taken');
    }

    user = await this.usersService.create(createUserDto);
    return user;
  }

  async login(user: User): Promise<AccessTokenResponse> {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
