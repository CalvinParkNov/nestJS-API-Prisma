import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { editUserDto } from 'src/user/dto';
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
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  //e2e test
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'something@gmail.com',
      password: '1234',
    };
    it('should throw error if email is empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          password: dto.password,
        })
        .expectStatus(400);
    });

    it('should throw error if password is empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          password: dto.email,
        })
        .expectStatus(400);
    });

    it('should throw error if email is not proper', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: 'alskjdhf',
        })
        .expectStatus(400)
        .inspect();
    });

    it('should throw error if email and password are not provided', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400);
    });

    it('should signup', () => {
      return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
    });

    describe('Signin', () => {
      it('should throw error if email is not proper', () => {
        return pactum
          .spec()
          .post('/auth/Signin')
          .withBody({
            email: 'alskjdhf',
          })
          .expectStatus(400)
          .inspect();
      });

      it('should throw error if email and password are not provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should Signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Edit user', () => {
      it('Should edit user', () => {
        const dto: editUserDto = {
          firstName: 'Calvinpark',
          email: 'asdf@gmail.com',
        };
        return pactum
          .spec()
          .patch('/user')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark by ID', () => {});

    describe('Get bookmarks by ID', () => {});

    describe('Edit bookmark by ID', () => {});

    describe('Delete book', () => {});
  });
});
