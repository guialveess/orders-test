import { Request, Response } from "express";
import { ordersService } from "../services/orders.service";
import { OrderState } from "../models/orders/order.enums";

export class OrdersController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: 'Body inválido ou ausente' });
      }

      const { lab, patient, customer, services } = req.body;

      if (!lab || !patient || !customer) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes" });
      }

      const order = await ordersService.create({ lab, patient, customer, services });

      return res.status(201).json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar pedido";
      return res.status(400).json({ message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { state, page, limit } = req.query;

      const options = {
        state: state as OrderState,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      };

      const orders = await ordersService.list(options);

      return res.json(orders);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao listar pedidos";
      return res.status(500).json({ message });
    }
  }

  async advanceState(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID do pedido é obrigatório" });
      }

      const order = await ordersService.advanceOrderState(id);

      return res.json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao avançar estado do pedido";
      
      if (message.includes("não encontrado")) {
        return res.status(404).json({ message });
      }
      if (message.includes("finalizado")) {
        return res.status(400).json({ message });
      }
      
      return res.status(500).json({ message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "ID do pedido é obrigatório" });
      }

      const order = await ordersService.getOrderById(id);

      return res.json(order);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao buscar pedido";
      
      if (message.includes("não encontrado")) {
        return res.status(404).json({ message });
      }
      
      return res.status(500).json({ message });
    }
  }
}

export const ordersController = new OrdersController();
