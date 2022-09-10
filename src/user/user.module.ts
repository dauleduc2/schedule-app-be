import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Connection } from 'typeorm';
import { User } from 'src/core/models';
import { UserRepository } from 'src/core/repositories';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: UserRepository,
            useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
            inject: [Connection],
        },
    ],
    exports: [UserService, UserRepository],
})
export class UserModule {}
