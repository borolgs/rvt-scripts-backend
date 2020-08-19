import { AuthGuard } from '@nestjs/passport';

export class LocalSignupGuard extends AuthGuard('signup') {}
