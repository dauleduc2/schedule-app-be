import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';

@Entity()
export class Image {
    @ApiProperty({ description: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'url' })
    @Column({ default: null })
    url: string;
}

export const imageValidateSchema = {
    url: joi.string().trim().lowercase().required(),
};
