import { EntityRepository } from 'typeorm';
import { RepositoryService } from './repository';
import { Spending } from '../models/spending';

@EntityRepository(Spending)
export class SpendingRepository extends RepositoryService<Spending> {}
