import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { usersRepository } from "../repositories/users.repository";
import { IRegisterDTO } from "../dtos/register.user.dto"
import { ILoginDTO } from "../dtos/login.user.dto"

export interface IAuthResponse {
  token: string;
}

export interface IUserResponse {
  id: string;
  email: string;
}

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = "1d";
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "default-secret";
  }

  async register(data: IRegisterDTO): Promise<IUserResponse> {
    const userExists = await usersRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error("Usuário já existe");
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = await usersRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: (user as any)._id?.toString(),
      email: user.email,
    };
  }

  async login(data: ILoginDTO): Promise<IAuthResponse> {
    const user = await usersRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { userId: (user as any)._id?.toString() },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return { token };
  }

  async verifyToken(token: string): Promise<{ userId: string }> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
}

export const authService = new AuthService();
