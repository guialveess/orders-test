import { OrderState, OrderStatus, ServiceStatus } from "./order.enums";

export interface IService {
  name: string;
  value: number;
  status: ServiceStatus;
}

export interface IOrder {
  lab: string;
  patient: string;
  customer: string;
  services: IService[];
  state: OrderState;
  status: OrderStatus;
}
