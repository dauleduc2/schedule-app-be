import { Body, Controller, HttpException, Post, Req, Res, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { constant } from 'src/core';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, vLoginDTO, vRegisterDTO } from './dto';

@ApiTags('Authentication')
@Controller(AuthController.endPoint)
export class AuthController {
    static endPoint = '/api/auth';

    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

    @Post('/register')
    @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vRegisterDTO))
    async cRegister(@Body() body: RegisterDTO, @Res() res: Response) {
        const existedUser = await this.userService.findOne('email', body.email);
        if (existedUser) throw new HttpException({ email: 'field.field-taken' }, StatusCodes.BAD_REQUEST);
        const newUser = await this.authService.createOne(body.name, body.email, body.password);

        const accessToken = await this.authService.createAccessToken(newUser);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.registerCookieTime }).send({ token: accessToken });
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login' })
    @ApiCreatedResponse({ type: String, description: 'access token' })
    @UsePipes(new JoiValidatorPipe(vLoginDTO))
    async cLogin(@Body() body: LoginDTO, @Res() res: Response) {
        const user = await this.userService.findOne('email', body.email);
        if (!user) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);

        const isCorrectPassword = await this.authService.decryptPassword(body.password, user.password);
        if (!isCorrectPassword) throw new HttpException({ errorMessage: 'error.invalid-password-username' }, StatusCodes.BAD_REQUEST);

        const accessToken = await this.authService.createAccessToken(user);
        return res.cookie(constant.authController.tokenName, accessToken, { maxAge: constant.authController.loginCookieTime }).send({ token: accessToken });
    }

    @Post('/logout')
    @ApiOperation({ summary: 'Logout user account' })
    async cLogout(@Req() req: Request, @Res() res: Response) {
        return res.cookie(constant.authController.tokenName, '', { maxAge: -999 }).send();
    }
}
