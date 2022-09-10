import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { userValidateSchema } from 'src/core/models';

export class UpdateUserDTO {
    @ApiProperty({ description: 'Name', example: 'Duc Dauuu' })
    name: string;
}

export const vUpdateUserDTO = joi.object<UpdateUserDTO>({
    name: userValidateSchema.name,
});
