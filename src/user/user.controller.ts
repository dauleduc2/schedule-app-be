import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { constant } from 'src/core';
import { QueryJoiValidatorPipe } from 'src/core/pipe/queryValidator.pipe';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import {
    ChangePasswordDTO,
    FilterUsersDTO,
    UpdateUserDTO,
    vChangePasswordDTO,
    vFilterUsersDto,
    vUpdateUserDTO,
} from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller(UserController.endPoint)
export class UserController {
    static endPoint = '/users';

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/me')
    @UseGuards(AuthGuard)
    async cGetMe(@Req() req: Request, @Res() res: Response) {
        return res.send(req.user);
    }

    @Get('/:userId')
    async cGetOneById(@Param('userId') userId: string, @Res() res: Response) {
        const user = await this.userService.findOne('id', userId);
        if (!user)
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.NOT_FOUND);
        return res.send(user);
    }

    @Put('/password')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidatorPipe(vChangePasswordDTO))
    async changePassword(
        @Body() body: ChangePasswordDTO,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        //get current user data
        const user = await this.userService.findOne('id', req.user.id);
        //check current input value is correct or not
        const isCorrectPassword = await this.authService.decryptPassword(
            body.currentPassword,
            user.password,
        );
        if (!isCorrectPassword) {
            throw new HttpException(
                { errorMessage: 'error.invalid_current_password' },
                StatusCodes.BAD_REQUEST,
            );
        }
        //change password to new password
        user.password = await this.authService.encryptPassword(
            body.newPassword,
            constant.default.hashingSalt,
        );
        await this.userService.updateOne(user);
        return res.send();
    }

    @Put('/')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateUserDTO))
    async updateUserInformation(
        @Body() body: UpdateUserDTO,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        //get current user data
        const user = await this.userService.findOne('id', req.user.id);
        // update field
        user.name = body.name;
        user.email = body.email;
        user.username = body.username;

        await this.userService.updateOne(user);
        return res.send();
    }

    @Get('/')
    @UsePipes(new QueryJoiValidatorPipe(vFilterUsersDto))
    async filterUsers(@Query() queries: FilterUsersDTO, @Res() res: Response) {
        const result = await this.userService.findMany(queries);

        return res.send(result);
    }
}
