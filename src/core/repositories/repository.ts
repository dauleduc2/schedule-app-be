import { PagingFilter, PagingResult } from '../interface/repositories.interface';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterOptionsBase } from '../interface/filter';
import { isFilterRange } from '../util/objectType';
import { getDateFromString } from '../util/date';

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
        return this.createQueryBuilder()
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
        leftJoinAndSelect,
    }: FilterOptionsBase<T>): Promise<[T[], number]> {
        const { tableName } = this.metadata;
        const query = this.createQueryBuilder(tableName);

        // query for exact key
        for (const [key, value] of Object.entries(where)) {
            // if object is range time, it's will be query with between time. Else for normal case

            if (isFilterRange(value)) {
                const { fromDate, toDate } = value;
                if (fromDate && toDate) {
                    query.andWhere(`${tableName}.${key} BETWEEN :fromDate AND :toDate`, {
                        fromDate: getDateFromString(fromDate).toISOString(),
                        toDate: getDateFromString(toDate).toISOString(),
                    });
                }
            } else {
                const newValue = String(value);

                if (newValue !== '' && typeof value != 'object') {
                    const queryOptions = this.queryWithOptions(tableName, key, [newValue]);

                    query.andWhere(`(${queryOptions})`);
                }
            }
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

        for (const item of leftJoinAndSelect) {
            query.leftJoinAndSelect(`${tableName}.${String(item.relation)}`, item.alias);
        }

        return [await query.getMany(), await query.getCount()];
    }
}
