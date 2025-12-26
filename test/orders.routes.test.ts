import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';
import { createTestUser, generateTestToken, getAuthHeaders } from './utils';

describe('Orders Routes', () => {
  describe('POST /orders', () => {
    it('should create an order successfully', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [
          { name: 'Service 1', value: 100 },
          { name: 'Service 2', value: 200 },
        ],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('lab', 'Lab A');
      expect(response.body).toHaveProperty('patient', 'Patient Name');
      expect(response.body).toHaveProperty('customer', 'Customer Name');
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveLength(2);
      expect(response.body).toHaveProperty('state', 'CREATED');
      expect(response.body).toHaveProperty('status', 'ACTIVE');
    });

    it('should return 401 if no token is provided', async () => {
      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const response = await request(app)
        .post('/orders')
        .send(orderData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não informado');
    });

    it('should return 401 if token is invalid', async () => {
      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders('invalid-token'))
        .send(orderData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });

    it('should return 400 if lab is missing', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Campos obrigatórios ausentes');
    });

    it('should return 400 if patient is missing', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Campos obrigatórios ausentes');
    });

    it('should return 400 if customer is missing', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Campos obrigatórios ausentes');
    });

    it('should return 400 if services array is empty', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Pedido deve conter ao menos um serviço');
    });

    it('should return 400 if total value is zero', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 0 }],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Valor total do pedido não pode ser zero');
    });

    it('should calculate total value correctly', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [
          { name: 'Service 1', value: 100 },
          { name: 'Service 2', value: 200 },
          { name: 'Service 3', value: 150 },
        ],
      };

      const response = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.services).toHaveLength(3);
    });
  });

  describe('GET /orders', () => {
    it('should return empty array when no orders exist', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const response = await request(app)
        .get('/orders')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return list of orders', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      // Create multiple orders
      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send({ ...orderData, lab: 'Lab B' });

      const response = await request(app)
        .get('/orders')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should filter orders by state', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      const response = await request(app)
        .get('/orders?state=CREATED')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((order: any) => {
        expect(order.state).toBe('CREATED');
      });
    });

    it('should paginate results', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      // Create 15 orders
      for (let i = 0; i < 15; i++) {
        await request(app)
          .post('/orders')
          .set(getAuthHeaders(token))
          .send({ ...orderData, lab: `Lab ${i}` });
      }

      const response = await request(app)
        .get('/orders?page=1&limit=10')
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(10);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/orders');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não informado');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .get('/orders')
        .set(getAuthHeaders('invalid-token'));

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });
  });

  describe('PATCH /orders/:id/advance', () => {
    it('should advance order state from CREATED to ANALYSIS', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const createResponse = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      const orderId = createResponse.body._id;

      const response = await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('state', 'ANALYSIS');
    });

    it('should advance order state from ANALYSIS to COMPLETED', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const createResponse = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      const orderId = createResponse.body._id;

      // Advance to ANALYSIS
      await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      // Advance to COMPLETED
      const response = await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('state', 'COMPLETED');
    });

    it('should return 404 if order does not exist', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .patch(`/orders/${fakeId}/advance`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Pedido não encontrado');
    });

    it('should return 400 if order is already COMPLETED', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id.toString());

      const orderData = {
        lab: 'Lab A',
        patient: 'Patient Name',
        customer: 'Customer Name',
        services: [{ name: 'Service 1', value: 100 }],
      };

      const createResponse = await request(app)
        .post('/orders')
        .set(getAuthHeaders(token))
        .send(orderData);

      const orderId = createResponse.body._id;

      // Advance to ANALYSIS
      await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      // Advance to COMPLETED
      await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      // Try to advance again
      const response = await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set(getAuthHeaders(token));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Pedido já está finalizado');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .patch('/orders/507f1f77bcf86cd799439011/advance');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não informado');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .patch('/orders/507f1f77bcf86cd799439011/advance')
        .set(getAuthHeaders('invalid-token'));

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token inválido');
    });
  });
});
