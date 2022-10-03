import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';
import { UserModule } from './user/user.module';
import { SpendingModule } from './spending/spending.module';
import { SpendingController } from './spending/spending.controller';

@Module({
    imports: [DbModule, UserModule, AuthModule, SpendingModule],
    controllers: [],
})
export class AppModule {}
