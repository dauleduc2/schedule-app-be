import { FindManyOptions } from 'typeorm';

export interface FilterRangeTime {
    fromDate: string;
    toDate: string;
}

export interface FilterOptionsBase<T> extends Omit<FindManyOptions<T>, 'order' | 'where'> {
    orderBy?: keyof T | null;
    order?: 'ASC' | 'DESC';
    where?: {
        [key in keyof T]?: string | number | FilterRangeTime;
    };
    leftJoinAndSelect?: { relation: keyof T; alias: string }[];
}
