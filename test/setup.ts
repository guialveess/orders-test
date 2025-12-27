import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { beforeAll, afterAll, afterEach } from 'vitest';

dotenv.config();

let mongoServer: MongoMemoryServer;

export const setupTestDatabase = async () => {
  // Configure mongoose to avoid buffering timeout issues
  mongoose.set('bufferCommands', false);
  mongoose.set('autoCreate', true);
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  console.log('Connecting to test database...');
  await mongoose.connect(uri);
  console.log('Test database connected');
};

export const teardownTestDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Test database disconnected');
  } catch (error) {
    console.error('Error during teardown:', error);
  }
};

export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

beforeAll(async () => {
  await setupTestDatabase();
}, 30000);

afterAll(async () => {
  await teardownTestDatabase();
}, 30000);

afterEach(async () => {
  await clearDatabase();
}, 10000);
