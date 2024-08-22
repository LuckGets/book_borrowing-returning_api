import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { Bcrypt } from './strategy/bcrypt';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, Bcrypt],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
