import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const rawHeader = req.headers['authorization'];

    if (!rawHeader) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다!');
    }

    const token = this.authService.extractTokenFromHeader(rawHeader, false);
    const { email, password } = this.authService.decodeBasicToken(token);

    const user = this.authService.authenticateWithEmailAndPassword({ email, password });

    req.user = user;

    return true;
  }
}
