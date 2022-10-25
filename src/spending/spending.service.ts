import { Injectable } from '@nestjs/common';
import { FilterOptionsBase } from 'src/core/interface/filter';
import { Spending } from 'src/core/models/spending';
import { SpendingRepository } from 'src/core/repositories/spending.repository';
import { getDateFromString } from 'src/core/util/date';
import { UserService } from 'src/user/user.service';
import { AddNewSpending } from './dto/addNewSpending';

@Injectable()
export class SpendingService {
    constructor(
        private readonly spendingRepository: SpendingRepository,
        private readonly userService: UserService,
    ) {}
    async createOne(ownerId, { title, description, date, note, value, type }: AddNewSpending) {
        const owner = await this.userService.findOne('id', ownerId);

        const newSpending = new Spending();
        newSpending.title = title;
        newSpending.description = description;
        newSpending.date = getDateFromString(date).toISOString();
        newSpending.note = note;
        newSpending.value = value;
        newSpending.owner = owner;
        newSpending.type = type;

        return this.spendingRepository.save(newSpending);
    }

    async findOne(field: keyof Spending, value: any): Promise<Spending> {
        return this.spendingRepository.findOneByField(field, value);
    }

    async updateOne(spending: Spending): Promise<Spending> {
        return this.spendingRepository.save(spending);
    }

    async getSpendingListWithCount(
        options: FilterOptionsBase<Spending>,
    ): Promise<[Spending[], number]> {
        return this.spendingRepository.findAndCountC({
            ...options,
            leftJoinAndSelect: [{ alias: 'owner', relation: 'owner' }],
        });
    }
}
