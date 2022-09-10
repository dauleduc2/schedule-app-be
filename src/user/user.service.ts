import { Injectable } from '@nestjs/common';
import { PagingResult } from 'src/core/interface';
import { User } from 'src/core/models';
import { UserRepository } from 'src/core/repositories';
import { FilterUsersDTO } from './dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async updateOne(user: User): Promise<User> {
        user.createAt = new Date().getTime();
        return await this.userRepository.save(user);
    }

    async findOne(field: keyof User, value: any): Promise<User> {
        return await this.userRepository.findOneByField(field, value);
    }

    async findMany(filter: FilterUsersDTO): Promise<PagingResult<User>> {
        const result = await this.userRepository.searchUserByName(filter);
        result.data = result.data.map((user) => ({ ...user, password: '' }));
        return result;
    }
}
