import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { userValidateSchema } from 'src/core/models';

export class RegisterDTO {
    @ApiProperty({ description: 'email', example: 'dauleduc2@gmail.com' })
    email: string;

    @ApiProperty({ description: 'username', example: 'dauleduc2' })
    username: string;

    @ApiProperty({ description: 'Name', example: 'Dau Le Duc' })
    name: string;

    @ApiProperty({ description: 'Password', example: '123456' })
    password: string;

    @ApiProperty({ description: 'Confirm password', example: '123456' })
    confirmPassword: string;
}

export const vRegisterDTO = joi.object<RegisterDTO>({
    name: userValidateSchema.name,
    username: userValidateSchema.username,
    email: userValidateSchema.email,
    password: userValidateSchema.password,
    confirmPassword: joi.string().required().valid(joi.ref('password')),
});
