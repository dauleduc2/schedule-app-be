import { FilterRangeTime } from '../interface/filter';

export const isFilterRange = (value: any): value is FilterRangeTime => {
    return value && value.fromDate && value.toDate;
};
