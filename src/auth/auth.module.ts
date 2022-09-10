import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/core';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [forwardRef(() => UserModule)],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: JwtService,
            useFactory: () => {
                return new JwtService({ secret: config.JWT_SECRET_KEY });
            },
        },
    ],
    exports: [AuthService],
})
export class AuthModule {}
