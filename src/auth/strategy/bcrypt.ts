import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');

@Injectable()
export class Bcrypt {
  async hash(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hashedPassword: string): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
