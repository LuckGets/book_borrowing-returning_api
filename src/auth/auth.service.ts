import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { Bcrypt } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: Bcrypt,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    emailOrPhone: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // Find the user in database
    const user = await this.userService.findUserByEmailOrPhone(emailOrPhone);

    // If there is no user in database
    if (!user) return null;

    // Check if password is correct or not
    if (!this.bcryptService.compare(password, user.password))
      throw new UnauthorizedException('Unauthorized');

    // Assign user id in to payload
    const payload = { id: user.id };

    // return accessToken which signed by JWT
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
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
    const hashedPassword = await this.bcryptService.hash(
      data.password,
      Number(process.env.BCRYPT_SALT),
    );

    // Changing the password to Hashed password
    data.password = hashedPassword;

    // Return the instance of User
    return this.userService.createUser(data);
  }
}
