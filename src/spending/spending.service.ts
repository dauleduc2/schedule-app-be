import { Injectable } from '@nestjs/common';
import { Spending } from 'src/core/models/spending';
import { SpendingRepository } from 'src/core/repositories/spending.repository';
import { AddNewSpending } from './dto/addNewSpending';

@Injectable()
export class SpendingService {
    constructor(private readonly spendingRepository: SpendingRepository) {}
    async createOne({ title, description, date, note, value }: AddNewSpending) {
        const newSpending = new Spending();
        newSpending.title = title;
        newSpending.description = description;
        newSpending.date = date;
        newSpending.note = note;
        newSpending.value = value;

        return await this.spendingRepository.save(newSpending);
    }

    async findOne(field: keyof Spending, value: any): Promise<Spending> {
        return await this.spendingRepository.findOneByField(field, value);
    }

    async updateOne(spending: Spending): Promise<Spending> {
        return await this.spendingRepository.save(spending);
    }
}
