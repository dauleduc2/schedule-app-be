import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { spendingValidateSchema } from 'src/core/models/spending';

export class AddNewSpending {
    @ApiProperty({ description: 'title', example: 'com hop' })
    title: string;

    @ApiProperty({ description: 'description', example: 'vinmart' })
    description: string;

    @ApiProperty({ description: 'note', example: 'day la note' })
    note: string;

    @ApiProperty({ description: 'value', example: '3.5' })
    value: number;

    @ApiProperty({ description: 'date', example: '3/3/2020' })
    date: string;
}

export const vAddNewSpending = joi.object<AddNewSpending>({
    title: spendingValidateSchema.title,
    description: spendingValidateSchema.description,
    note: spendingValidateSchema.note,
    value: spendingValidateSchema.value,
    date: spendingValidateSchema.date,
});
