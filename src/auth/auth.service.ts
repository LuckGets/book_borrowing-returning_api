import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { Token } from './dtos/authUser.dto';
import { Bcrypt } from './strategy/bcrypt';

export enum Role {
  user = 'user',
  admin = 'admin',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: Bcrypt,
  ) {}

  async signIn(emailOrPhone: string, password: string): Promise<Token> {
    // Find the user in database
    const user = await this.userService.findUserByEmailOrPhone(emailOrPhone);
    // If there is no user in database
    if (!user) return null;

    const isPasswordCorrect = this.compareHash(password, user.password);
    // Check if password is correct or not
    if (!isPasswordCorrect) throw new UnauthorizedException('Unauthorized');

    const tokens = await this.createTokens(user.id);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Assign user id in to payload
    // return accessToken which signed by JWT
    return tokens;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<Token> {
    // Find the duplication email in database
    const userWithDupeEmail = await this.userService.findUserByEmailOrPhone(
      data.email,
    );
    // If the database have the same eamil, return null
    if (userWithDupeEmail) return null;

    // Find the duplication phone in database
    const userWithDupePhone = await this.userService.findUserByEmailOrPhone(
      data.phone,
    );
    // if the database have the same phone, return null
    if (userWithDupePhone) return null;

    // Hashing the password
    const hashedPassword = await this.hashData(data.password);

    // Changing the password to Hashed password
    data.password = hashedPassword;

    data.role = Role.user;

    // Create the instance of User
    const user = await this.userService.createUser(data);

    // Create access and refresh tokens
    const tokens = await this.createTokens(user.id);

    // Updating refreshToken for the new user with hashed one
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // Return tokens back to client
    return tokens;
  }

  async createTokens(userId: number): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userService.update(userId, { refreshToken: hashedRefreshToken });
  }

  async logout(userId: number): Promise<User> {
    return this.userService.update(userId, { refreshToken: null });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById({ id: userId });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const isRefreshTokenMatches = await this.compareHash(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.createTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async hashData(data: string): Promise<string> {
    return await this.bcryptService.hash(data, Number(process.env.BCRYPT_SALT));
  }

  async compareHash(
    dataToCompare: string,
    hashedData: string,
  ): Promise<Boolean> {
    return await this.bcryptService.compare(dataToCompare, hashedData);
  }

  async isAdmin(accessToken: string) {
    const { id } = this.jwtService.verify(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const user = await this.userService.findUserById({ id: id });

    if (!user) throw new BadRequestException('User does not exist');

    return user.role === Role.admin;
  }
}
