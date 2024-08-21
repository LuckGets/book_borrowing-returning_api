import bcrypt from 'bcrypt';

export class Bcrypt {
  async hash(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async compare(password, hashedPassword): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
