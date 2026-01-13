/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

describe('AppController (E2E) - User Flow', () => {
  let app: INestApplication;

  let authCookie: string;
  let userId: string;
  let postId: string;

  const uniqueEmail = `e2e_test_${Date.now()}@example.com`;
  const userPassword = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>(
      new ExpressAdapter(),
    );

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // --- PASO 1: REGISTRO ---
  it('/auth/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'E2E User',
        email: uniqueEmail,
        password: userPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(uniqueEmail);

    userId = response.body.id;
  });

  // --- PASO 2: LOGIN ---
  it('/auth/login (POST) - should login and return cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: userPassword,
      })
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.message).toBe('Login exitoso');

    const cookies = response.get('Set-Cookie');
    expect(cookies).toBeDefined();

    authCookie = cookies!.find((cookie) => cookie.startsWith('access_token'))!;
    expect(authCookie).toBeDefined();
  });

  // --- PASO 3: CREAR POST (PROTEGIDO) ---
  it('/posts (POST) - should create a post using auth cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Cookie', [authCookie])
      .send({
        title: 'E2E Post Title',
        content: 'Content created during E2E test',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('E2E Post Title');
    expect(response.body.user_id).toBe(userId);

    postId = response.body.id;
  });

  // --- PASO 4: VERIFICAR QUE EL POST EXISTE (PÚBLICO) ---
  it('/posts/:id (GET) - should return the created post', async () => {
    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .expect(200);

    expect(response.body.id).toBe(postId);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.name).toBe('E2E User');
  });

  // --- PASO 5: EDITAR PERFIL (PROTEGIDO) ---
  it('/users/:id (PUT) - should update user profile', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Cookie', [authCookie])
      .send({
        name: 'E2E User Updated',
      })
      .expect(200);

    expect(response.body.name).toBe('E2E User Updated');
  });

  // --- PASO 6: INTENTO NO AUTORIZADO (SEGURIDAD) ---
  it('/posts (POST) - should fail without cookie', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'Hacker Post',
        content: 'Should fail',
      })
      .expect(401);
  });
});
