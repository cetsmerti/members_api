import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const configDB = {
  useFactory: (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [
      __dirname + '/../**/*.model.js',
      'dist/**/*.model.js',
      __dirname + '/../**/*.model.ts',
    ],
  }),
};
