import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha obrigatórios" });
      }

      const user = await authService.register({ email, password });

      return res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao registrar usuário";

      if (message.includes("já existe")) {
        return res.status(409).json({ message });
      }

      return res.status(400).json({ message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha obrigatórios" });
      }

      const authResponse = await authService.login({ email, password });

      return res.json(authResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao fazer login";

      if (message.includes("Credenciais inválidas")) {
        return res.status(401).json({ message });
      }

      return res.status(500).json({ message });
    }
  }
}

export const authController = new AuthController();
