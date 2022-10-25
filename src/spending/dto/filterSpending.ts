import { SortOrder } from './../../core/interface';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { Spending, SpendingType } from 'src/core/models/spending';
export class FilterSpendingsDTO {
    @ApiProperty({ description: 'Title', example: '', nullable: true })
    title: string;

    @ApiProperty({ description: 'description', example: '', nullable: true })
    description: string;

    @ApiProperty({ description: 'value', example: '', nullable: true })
    value: number;

    @ApiProperty({ description: 'note', example: '', nullable: true })
    note: string;

    @ApiProperty({ description: 'type', example: 'INCOME', nullable: true })
    type: SpendingType;

    @ApiProperty({ description: 'from date', example: '', nullable: true })
    fromDate: string;

    @ApiProperty({ description: 'to date', example: '', nullable: true })
    toDate: string;

    @ApiProperty({ description: 'Current Page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'Page Size', example: '4', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Order', example: 'ASC', nullable: true })
    order: SortOrder;

    @ApiProperty({ description: 'Order By', example: 'ASC', nullable: true })
    orderBy: keyof Spending;
}

export const vFilterSpendingDTO = joi.object<FilterSpendingsDTO>({
    title: joi.string().required().failover(''),
    description: joi.string().required().failover(''),
    value: joi.number().required().failover(''),
    note: joi.string().required().failover(''),
    type: joi.string().allow('INCOME', 'WITHDRAW').required().failover(''),
    fromDate: joi.string().required().failover(''),
    toDate: joi.string().required().failover(''),
    orderBy: joi.string().required().failover(''),
    currentPage: joi.number().min(0).failover(0),
    pageSize: joi.number().min(1).failover(4),
    order: joi.string().required().failover(SortOrder.ASC).valid(SortOrder.ASC, SortOrder.DESC),
});
