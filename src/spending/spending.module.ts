import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/core/models';
import { SpendingRepository } from 'src/core/repositories/spending.repository';
import { UserModule } from 'src/user/user.module';
import { Connection } from 'typeorm';
import { SpendingController } from './spending.controller';
import { SpendingService } from './spending.service';
import { SpendingsController } from './spendings.controller';

@Module({
    imports: [AuthModule, UserModule, TypeOrmModule.forFeature([User])],
    controllers: [SpendingController, SpendingsController],
    providers: [
        SpendingService,
        {
            provide: SpendingRepository,
            useFactory: (connection: Connection) =>
                connection.getCustomRepository(SpendingRepository),
            inject: [Connection],
        },
    ],
})
export class SpendingModule {}
