require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

const user = { name: 'Himanshu', email: 'himanshu@gmail.com', password: 'test1234' };

async function signupAndLogin() {
  await request(app).post('/auth/signup').send(user);
  const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
  return res.body.token;
}

describe('Auth', () => {
  test('signup creates a user and hides the password', async () => {
    const res = await request(app).post('/auth/signup').send(user);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });

  test('signup with the same email returns 409', async () => {
    await request(app).post('/auth/signup').send(user);
    const res = await request(app).post('/auth/signup').send(user);
    expect(res.status).toBe(409);
  });

  test('signup with an invalid email returns 400', async () => {
    const res = await request(app).post('/auth/signup').send({ ...user, email: 'abc' });
    expect(res.status).toBe(400);
  });

  test('login with the correct password returns a token', async () => {
    await request(app).post('/auth/signup').send(user);
    const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login with a wrong password returns 401', async () => {
    await request(app).post('/auth/signup').send(user);
    const res = await request(app).post('/auth/login').send({ email: user.email, password: 'wrong123' });
    expect(res.status).toBe(401);
  });

  test('/me without a token returns 401', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  test('/me with a valid token returns the user', async () => {
    const token = await signupAndLogin();
    const res = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });
});