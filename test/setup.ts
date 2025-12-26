import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { beforeAll, afterAll, afterEach } from 'vitest';

dotenv.config();

let mongoServer: MongoMemoryServer;

export const setupTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  console.log('Test database connected');
};

export const teardownTestDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  console.log('Test database disconnected');
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

afterEach(async () => {
  await clearDatabase();
});
