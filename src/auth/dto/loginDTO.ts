import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema } from 'src/core/models';
export class LoginDTO {
    @ApiProperty({ description: 'Username', example: 'dauleduc2' })
    username: string;

    @ApiProperty({ description: 'Password', example: '12345678' })
    password: string;
}

export const vLoginDTO = joi.object<LoginDTO>({
    username: userValidateSchema.username,
    password: userValidateSchema.password,
});
