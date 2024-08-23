import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { Bcrypt } from './strategy/bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, Bcrypt, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService, AdminGuard, JwtModule],
})
export class AuthModule {}
