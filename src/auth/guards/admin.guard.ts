import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return null;

    const accessToken = request.headers.authorization
      .split('Bearer')[1]
      .slice(1);
    if (!accessToken) return null;

    return this.authService.isAdmin(accessToken);
  }

  verify(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }
}
