import { PagingFilter, PagingResult } from '../interface/repositories.interface';
import { FindConditions, FindManyOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../models';
import { asyncScheduler } from 'rxjs';

interface CustomFindManyOptions<Entity> extends Omit<FindManyOptions<Entity>, 'order' | 'where'> {
    orderBy: keyof Entity | null;
    order: 'ASC' | 'DESC';
    where: FindConditions<Entity>;
}

export class RepositoryService<T> extends Repository<T> {
    protected defaultQuery(tableName: string) {
        return `AND ${tableName}.deletedAt IS NULL`;
    }

    protected queryWithOptions(tableName: string, field: string, value: string[]) {
        return value.map((item) => ` ${tableName}.${field} LIKE '%${item}%'`).join(' ');
    }

    protected async paging(
        query: SelectQueryBuilder<T>,
        pagingProps: PagingFilter,
    ): Promise<PagingResult<T>> {
        const { tableName } = this.metadata;

        try {
            const data = await query
                .orderBy(`${tableName}.${pagingProps.orderBy}`, pagingProps.order)
                .skip(pagingProps.page * pagingProps.pageSize)
                .take(pagingProps.pageSize)
                .getMany();

            const count = await query.getCount();

            return { data, count };
        } catch (err) {
            return { data: [], count: 0 };
        }
    }

    public async findOneByField(field: keyof T, value: any): Promise<T> {
        const result = await this.createQueryBuilder()
            .where(`${field.toString()} = :value`, { value })
            .getOne();
        return result;
    }

    public async findManyByField(field: keyof T, value: any) {
        return await this.createQueryBuilder()
            .where(`"${field.toString()}" = :value`, { value })
            .getMany();
    }

    public async findAndCountC({
        skip = null,
        take = null,
        order = 'DESC',
        orderBy,
        where = {},
        select = [],
    }: CustomFindManyOptions<T>): Promise<[T[], number]> {
        const { tableName } = this.metadata;
        const query = this.createQueryBuilder(tableName);

        // query for exact key
        for (const [key, value] of Object.entries(where)) {
            const newValue = String(value) as string;
            const queryOptions = this.queryWithOptions(tableName, key, [newValue]);

            query.andWhere(`(${queryOptions})`);
        }

        // query for orderBy
        if (orderBy && typeof orderBy === 'string') query.orderBy(`${tableName}.${orderBy}`, order);

        // query take & skip
        if (skip) query.skip(skip);
        if (take) query.take(take);

        // query for select
        const selectFields = [];
        for (const item of select) {
            selectFields.push(`${tableName}.${String(item)}`);
        }
        if (selectFields.length) query.select(selectFields);

        return await [await query.getMany(), await query.getCount()];
    }
}
