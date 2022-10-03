import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './core';
import { ImageUrl, Task, User } from './core/models';
import { Spending } from './core/models/spending';

export const DbModule = TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    keepConnectionAlive: true,
    entities: [User, Task, ImageUrl, Spending],
    extra: { connectionLimit: 1 },
});
