export interface ICreateOrderDTO {
  lab: string;
  patient: string;
  customer: string;
  services: Array<{ name: string; value: number }>;
}