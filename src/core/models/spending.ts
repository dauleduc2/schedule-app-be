import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { User } from './user';

@Entity()
export class Spending {
    @ApiProperty({ description: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'title' })
    @Column({ default: null })
    title: string;

    @ApiProperty({ description: 'description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'value' })
    @Column({ default: null })
    value: number;

    @ApiProperty({ description: 'note' })
    @Column({ default: null })
    note: string;

    @ApiProperty({ description: 'date' })
    @Column({ default: null })
    date: string;

    @ApiProperty({ description: 'owner' })
    @ManyToOne(() => User, (user) => user)
    owner: User;
}

export const spendingValidateSchema = {
    title: joi.string().min(5).max(40).required(),
    description: joi.string().max(255).required(),
    value: joi.number().required(),
    note: joi.string().required(),
    date: joi.string().required(),
};
