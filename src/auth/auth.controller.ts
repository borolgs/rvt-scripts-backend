/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Post, Request, Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalSignupGuard } from './guards/local-signup.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<AccessTokenResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalSignupGuard)
  @Post('auth/signup')
  async signup(@Request() req): Promise<AccessTokenResponse> {
    return this.authService.login(req.user);
  }
}
