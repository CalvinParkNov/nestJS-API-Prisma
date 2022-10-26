import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });

  //e2e test
  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'something@gmail.com',
          password: '1234',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {});
  });

  describe('User', () => {
    describe('Get me', () => {});

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete book', () => {});
  });
});
