import { Order } from "../models/orders/order.schema";
import { IOrder } from "../models/orders/order.interface";
import { Types } from "mongoose";

export interface IFindOrdersOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export class OrdersRepository {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = await Order.create(orderData);
    return order.toObject() as IOrder;
  }

  async findById(id: string): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const order = await Order.findById(id);
    return order ? order.toObject() as IOrder : null;
  }

  async find(
    query: Record<string, any>,
    options: IFindOrdersOptions = {}
  ): Promise<IOrder[]> {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return orders.map(order => order.toObject() as IOrder);
  }

  async update(id: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return order ? order.toObject() as IOrder : null;
  }

  async delete(id: string): Promise<IOrder | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const order = await Order.findByIdAndDelete(id);
    return order ? order.toObject() as IOrder : null;
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    return await Order.countDocuments(query);
  }
}

export const ordersRepository = new OrdersRepository();
