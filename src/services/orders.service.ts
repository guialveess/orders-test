import { ordersRepository } from "../repositories/orders.repository";
import { IOrder, IService } from "../models/orders/order.interface";
import { OrderState, OrderStatus, ServiceStatus } from "../models/orders/order.enums";
import { ICreateOrderDTO } from "../dtos/create.order.dto";

export interface IListOrdersOptions {
  state?: OrderState;
  page?: number;
  limit?: number;
}

export class OrdersService {
  async create(data: ICreateOrderDTO): Promise<IOrder> {
    if (!data.services || data.services.length === 0) {
      throw new Error("Pedido deve conter ao menos um serviço");
    }

    const totalValue = data.services.reduce(
      (sum: number, service: { name: string; value: number }) => sum + (service.value || 0),
      0
    );

    if (totalValue <= 0) {
      throw new Error("Valor total do pedido não pode ser zero");
    }

    const services: IService[] = data.services.map((service) => ({
      name: service.name,
      value: service.value,
      status: ServiceStatus.PENDING,
    }));

    const orderData: Partial<IOrder> = {
      lab: data.lab,
      patient: data.patient,
      customer: data.customer,
      services,
      state: OrderState.CREATED,
      status: OrderStatus.ACTIVE,
    };

    return await ordersRepository.create(orderData);
  }

  async list(options: IListOrdersOptions = {}): Promise<IOrder[]> {
    const { state, page = 1, limit = 10 } = options;

    const query: Record<string, any> = { status: OrderStatus.ACTIVE };

    if (state) {
      query.state = state;
    }

    const skip = (page - 1) * limit;

    return await ordersRepository.find(query, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });
  }

  async advanceOrderState(orderId: string): Promise<IOrder> {
    const order = await ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const stateFlow: Partial<Record<OrderState, OrderState>> = {
      [OrderState.CREATED]: OrderState.ANALYSIS,
      [OrderState.ANALYSIS]: OrderState.COMPLETED,
    };

    const nextState = stateFlow[order.state];

    if (!nextState) {
      throw new Error("Pedido já está finalizado");
    }

    const updatedOrder = await ordersRepository.update(orderId, {
      state: nextState,
    });

    if (!updatedOrder) {
      throw new Error("Erro ao atualizar pedido");
    }

    return updatedOrder;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return order;
  }
}

export const ordersService = new OrdersService();
