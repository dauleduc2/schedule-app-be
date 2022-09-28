import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { userValidateSchema } from 'src/core/models';

export class UpdateUserDTO {
    @ApiProperty({ description: 'Name', example: 'Duc Dauuu' })
    name: string;

    @ApiProperty({ description: 'Email', example: 'dauleduc3@gmail.com' })
    email: string;

    @ApiProperty({ description: 'username', example: 'Duc Dauuu' })
    username: string;
}

export const vUpdateUserDTO = joi.object<UpdateUserDTO>({
    name: userValidateSchema.name,
    email: userValidateSchema.email,
    username: userValidateSchema.username,
});
