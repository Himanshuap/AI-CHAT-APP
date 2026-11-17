require('dotenv').config({ quiet: true });
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

async function getToken() {
  const user = { name: 'Himanshu', email: 'himanshu@gmail.com', password: 'test1234' };
  await request(app).post('/auth/signup').send(user);
  const res = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
  return res.body.token;
}

describe('Messages', () => {
  test('sending without a token returns 401', async () => {
    const res = await request(app).post('/messages').send({ text: 'hi' });
    expect(res.status).toBe(401);
  });

  test('sending a message saves it with the sender name', async () => {
    const token = await getToken();
    const res = await request(app).post('/messages').set('Authorization', `Bearer ${token}`).send({ text: 'hi' });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('hi');
    expect(res.body.sender.name).toBe('Himanshu');
  });

  test('text as a number returns 400', async () => {
    const token = await getToken();
    const res = await request(app).post('/messages').set('Authorization', `Bearer ${token}`).send({ text: 123 });
    expect(res.status).toBe(400);
  });

  test('a fake sender in the body is ignored', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'hi', sender: '000000000000000000000000' });
    expect(res.body.sender.name).toBe('Himanshu');
  });

  test('getting messages returns the list, newest first', async () => {
    const token = await getToken();
    await request(app).post('/messages').set('Authorization', `Bearer ${token}`).send({ text: 'first' });
    await request(app).post('/messages').set('Authorization', `Bearer ${token}`).send({ text: 'second' });
    const res = await request(app).get('/messages').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].text).toBe('second');
  });
});