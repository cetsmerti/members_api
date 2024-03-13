import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserType } from 'src/module/user/enums/type-user.enum';

describe('members test (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  const settings = {
    baseSalary: 1000,
  };
  interface member {
    id?: string;
    name: string;
    dateJoin: Date;
    type: UserType;
  }
  const exepectSalaryEmployee = (member: any) => {
    const yearsWorked =
      new Date().getFullYear() - new Date(member.dateJoin).getFullYear();

    const salaryIncreasePercentage = Math.min(0.03 * yearsWorked, 0.3);

    return Math.round(settings.baseSalary * (1 + salaryIncreasePercentage));
  };
  it('/user (POST)', async () => {
    const member1 = {
      name: 'John Doe',
      dateJoin: new Date(),
      type: UserType.Employee,
    };

    return await request(app.getHttpServer())
      .post('/user')
      .send(member1)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member1.name);
        expect(res.body.type).toEqual(member1.type);
        expect(res.body.salary).toEqual(1000);
      });
  });

  it('/user dateJoin 2020 year (POST)', async () => {
    const member2 = {
      name: 'Axe',
      type: UserType.Employee,
      dateJoin: '2020-03-13T19:14:12.529',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member2)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member2.name);
        expect(res.body.type).toEqual(member2.type);
        expect(res.body.salary).toEqual(exepectSalaryEmployee(member2));
      });
  });

  it('/user dateJoin 2000 year (POST)', async () => {
    const member3 = {
      id: undefined,
      name: 'Fix1',
      type: UserType.Employee,
      dateJoin: '2000-03-13T19:14:12.529',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member3)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member3.name);
        expect(res.body.type).toEqual(member3.type);
        expect(res.body.salary).toEqual(exepectSalaryEmployee(member3));
      });
  });

  it('/user reletion (POST)', async () => {
    const member3 = {
      id: undefined,
      name: 'Fix',
      type: UserType.Employee,
      dateJoin: '2000-03-13T19:14:12.529',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member3)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member3.name);
        expect(res.body.type).toEqual(member3.type);
        expect(res.body.salary).toEqual(exepectSalaryEmployee(member3));
      })
      .then((el) => (member3.id = el.body.id));

    const member4 = {
      id: undefined,
      name: 'Nik',
      type: UserType.Manager,
      dateJoin: '2010-03-13T19:14:12.529',
      subordinates: [member3.id],
    };
    await request(app.getHttpServer())
      .post('/user')
      .send(member4)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member4.name);
        expect(res.body.type).toEqual(member4.type);
        expect(res.body.subordinates).toBeInstanceOf(Array);
      })
      .then((el) => (member4.id = el.body.id));

    const member5 = {
      id: undefined,
      name: 'Lisa',
      type: UserType.Employee,
      dateJoin: '2011-03-13T19:14:12.529',
      supervisor: [member4.id],
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member5)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member5.name);
        expect(res.body.type).toEqual(member5.type);
        expect(res.body.salary).toEqual(exepectSalaryEmployee(member5));
        expect(res.body.supervisor).toBeInstanceOf(Array);
      });

    const member6 = {
      id: undefined,
      name: 'Ann',
      type: UserType.Salesman,
      dateJoin: '2018-03-13T19:14:12.529',
      supervisor: [member4.id],
      subordinates: [member3.id, member5.id],
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member6)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member6.name);
        expect(res.body.type).toEqual(member6.type);
        expect(res.body.subordinates).toBeInstanceOf(Array);
        expect(res.body.supervisor).toBeInstanceOf(Array);
      })
      .then((el) => (member6.id = el.body.id));

    const member7 = {
      id: undefined,
      name: 'Nastya',
      type: UserType.Salesman,
      dateJoin: '2009-03-13T19:14:12.529',
      supervisor: [member6.id],
      subordinates: [member3.id, member5.id],
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member7)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual(member7.name);
        expect(res.body.type).toEqual(member7.type);
        expect(res.body.subordinates).toBeInstanceOf(Array);
        expect(res.body.supervisor).toBeInstanceOf(Array);
      });
  });

  it('/user (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/user')
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/user/:id (GET)', async () => {
    const member33 = {
      id: undefined,
      name: 'Fix33',
      type: UserType.Employee,
      dateJoin: '2000-03-13T19:14:12.529',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member33)
      .expect(201)
      .then((el) => (member33.id = el.body.id));

    await request(app.getHttpServer())
      .get(`/user/${member33.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual(member33.name);
        expect(res.body.type).toEqual(member33.type);
        expect(res.body.dateJoin).toEqual(member33.dateJoin);
        expect(res.body.id).toEqual(member33.id);
      });
  });

  it('/user (DELETE)', async () => {
    const member44 = {
      id: undefined,
      name: 'Fix44',
      type: UserType.Employee,
      dateJoin: '2000-03-13T19:14:12.529',
    };

    await request(app.getHttpServer())
      .post('/user')
      .send(member44)
      .expect(201)
      .then((el) => (member44.id = el.body.id));

    await request(app.getHttpServer())
      .delete(`/user/${member44.id}`)
      .expect(200);
  });

  it('/user/sallary (GET)', async () => {
    await request(app.getHttpServer()).get(`/user/sallary`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
