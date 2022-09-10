import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { joiPasswordExtendCore, JoiPasswordExtend } from 'joi-password';
import * as joi from 'joi';

const joiPassword: JoiPasswordExtend = joi.extend(joiPasswordExtendCore);

@Entity()
export class User {
    @ApiProperty({ description: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Name' })
    @Column({ default: null })
    name: string;

    @ApiProperty({ description: 'User name' })
    @Column({ default: null })
    username: string;

    @ApiProperty({ description: 'Password' })
    @Column({ default: null })
    password: string;

    @ApiProperty({ description: 'Email' })
    @Column({ default: null })
    email: string;
}

export const userValidateSchema = {
    name: joi.string().min(5).max(40).trim().lowercase().required(),
    email: joi.string().min(5).max(255).email().trim().lowercase().required(),
    username: joi.string().max(32).min(5).lowercase().alphanum().required(),
    password: joiPassword.string().min(8).max(32).noWhiteSpaces().required(),
};
