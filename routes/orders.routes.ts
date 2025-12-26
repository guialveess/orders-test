import { Router } from "express";
import { Order } from "../src/models/orders/order.schema";
import { OrderState, OrderStatus, ServiceStatus } from "../src/models/orders/order.enums";

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Campos obrigatórios ausentes ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", async (req, res) => {
  const { lab, patient, customer, services } = req.body ?? {};

  if (!req.body || typeof req.body !== 'object') {
  return res.status(400).json({ message: 'Body inválido ou ausente' });
  }

  if (!lab || !patient || !customer) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  if (!Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ message: "Pedido deve conter ao menos um serviço" });
  }

  const totalValue = services.reduce(
    (sum: number, service: any) => sum + (service.value || 0),
    0
  );

  if (totalValue <= 0) {
    return res
      .status(400)
      .json({ message: "Valor total do pedido não pode ser zero" });
  }

  const order = await Order.create({
    lab,
    patient,
    customer,
    services: services.map((service: any) => ({
      name: service.name,
      value: service.value,
      status: ServiceStatus.PENDING,
    })),
    state: OrderState.CREATED,
    status: OrderStatus.ACTIVE,
  });

  return res.status(201).json(order);
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [CREATED, ANALYSIS, COMPLETED]
 *         description: Filtrar por estado do pedido
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
  const { state, page = 1, limit = 10 } = req.query;

  const query: any = { status: OrderStatus.ACTIVE };

  if (state) {
    query.state = state;
  }

  const orders = await Order.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  return res.json(orders);
});

/**
 * @swagger
 * /orders/{id}/advance:
 *   patch:
 *     summary: Avançar o estado de um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Estado do pedido avançado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Pedido já está finalizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/advance", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  const stateFlow: Record<string, OrderState> = {
    [OrderState.CREATED]: OrderState.ANALYSIS,
    [OrderState.ANALYSIS]: OrderState.COMPLETED,
  };

  const nextState = stateFlow[order.state];

  if (!nextState) {
    return res
      .status(400)
      .json({ message: "Pedido já está finalizado" });
  }

  order.state = nextState;
  await order.save();

  return res.json(order);
});

export default router;

