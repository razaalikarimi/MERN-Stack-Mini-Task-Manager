// tests/tasks.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

async function createUserAndGetToken(role = 'member') {
  const password = await bcrypt.hash('pass123', 10);
  const user = await User.create({ name: 'U', email: `${Math.random()}@x.com`, password, role });
  const res = await request(app).post('/auth/login').send({ email: user.email, password: 'pass123' });
  return { user, token: res.body.token };
}

test('member creates a task and can fetch their tasks', async () => {
  const { user, token } = await createUserAndGetToken('member');
  const createRes = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({
    title: 'My Task',
    description: 'desc'
  });
  expect(createRes.statusCode).toBe(201);
  const listRes = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`);
  expect(listRes.statusCode).toBe(200);
  expect(listRes.body.total).toBe(1);
});

test('admin can get users', async () => {
  const { user, token } = await createUserAndGetToken('admin');
  const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
  expect(res.statusCode).toBe(200);
});
