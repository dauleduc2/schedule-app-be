import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { spendingValidateSchema } from 'src/core/models/spending';

export class UpdateSpending {
    @ApiProperty({ description: 'title', example: 'com hop' })
    title: string;

    @ApiProperty({ description: 'description', example: 'vinmart' })
    description: string;

    @ApiProperty({ description: 'note', example: 'day la update note' })
    note: string;

    @ApiProperty({ description: 'value', example: 3.5 })
    value: number;

    @ApiProperty({ description: 'date', example: '3/3/2020' })
    date: string;
}

export const vUpdateSpending = joi.object<UpdateSpending>({
    title: spendingValidateSchema.title.failover(''),
    description: spendingValidateSchema.description.failover(''),
    note: spendingValidateSchema.note.failover(''),
    value: spendingValidateSchema.value.failover(0),
    date: spendingValidateSchema.date.failover(''),
});
