import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { Image } from './image';
import { User } from './user';

@Entity()
export class Task {
    @ApiProperty({ description: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Create at' })
    @Column({ default: null })
    createdAt: string;

    @ApiProperty({ description: 'Update at' })
    @Column({ default: null })
    updatedAt: string;

    @ApiProperty({ description: 'title' })
    @Column({ default: null })
    title: string;

    @ApiProperty({ description: 'description' })
    @Column({ default: null })
    description: string;

    @ApiProperty({ description: 'priority' })
    @Column({ default: null })
    priority: number;

    @ApiProperty({ description: 'From date' })
    @Column({ default: null })
    fromDate: string;

    @ApiProperty({ description: 'To date' })
    @Column({ default: null })
    toDate: string;

    @ApiProperty({ description: 'image' })
    @OneToMany(() => Image, (image) => image)
    image: Image[];

    @ApiProperty({ description: 'owner' })
    @ManyToOne(() => User, (user) => user)
    owner: User;
}

export const taskValidateSchema = {
    title: joi.string().max(50).trim().required(),
    description: joi.string().min(0).max(1024).trim(),
    priority: joi.number().min(0).max(10),
    fromDate: joi.string(),
    toDate: joi.string(),
};
