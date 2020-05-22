import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const scryptAsync = promisify(scrypt);

export class JWTHelper {
  static async generateAuthToken(user: any, JWT_KEY: string) {
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_KEY
    );

    return userJwt;
  }

  static verify(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_KEY!);
      return payload;
    } catch (e) {
      return null;
    }
  }

  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buffer.toString("hex") === hashedPassword;
  }
}
