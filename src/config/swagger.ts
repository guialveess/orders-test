import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Management API',
      version: '1.0.0',
      description: 'CRUD API by guialveess',
      contact: {
        name: 'Guilherme Alves',
        email: '97guilherme.alves@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT de autenticação',
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do serviço',
            },
            value: {
              type: 'number',
              description: 'Valor do serviço',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'DONE'],
              description: 'Status do serviço',
            },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['lab', 'patient', 'customer', 'services'],
          properties: {
            lab: {
              type: 'string',
              description: 'Nome do laboratório',
            },
            patient: {
              type: 'string',
              description: 'Nome do paciente',
            },
            customer: {
              type: 'string',
              description: 'Nome do cliente',
            },
            services: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'value'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nome do serviço',
                  },
                  value: {
                    type: 'number',
                    description: 'Valor do serviço',
                  },
                },
              },
              description: 'Lista de serviços',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID do pedido',
            },
            lab: {
              type: 'string',
              description: 'Nome do laboratório',
            },
            patient: {
              type: 'string',
              description: 'Nome do paciente',
            },
            customer: {
              type: 'string',
              description: 'Nome do cliente',
            },
            services: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Service',
              },
              description: 'Lista de serviços',
            },
            state: {
              type: 'string',
              enum: ['CREATED', 'ANALYSIS', 'COMPLETED'],
              description: 'Estado do pedido',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'DELETED'],
              description: 'Status do pedido',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
