// tests/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
afterEach(async () => {
  await User.deleteMany();
});

test('register -> login -> get token', async () => {
  const regRes = await request(app).post('/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password'
  });
  expect(regRes.statusCode).toBe(200);
  expect(regRes.body.token).toBeTruthy();

  const loginRes = await request(app).post('/auth/login').send({
    email: 'test@example.com',
    password: 'password'
  });
  expect(loginRes.statusCode).toBe(200);
  expect(loginRes.body.token).toBeTruthy();
});
