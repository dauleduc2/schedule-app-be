import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from 'src/auth/auth.guard';
import { JoiValidatorPipe } from 'src/core/pipe/validator.pipe';
import { AddNewSpending, vAddNewSpending } from './dto/addNewSpending';
import { UpdateSpending, vUpdateSpending } from './dto/updateSpending';
import { SpendingService } from './spending.service';

@Controller('spending')
@ApiTags('Spending')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
export class SpendingController {
    constructor(private readonly spendingService: SpendingService) {}

    @Get('/:id')
    async cGetOneById(@Param('id') id: string, @Res() res: Response) {
        const spending = await this.spendingService.findOne('id', id);
        if (!spending)
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.NOT_FOUND);
        return res.send(spending);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create new spending' })
    @UsePipes(new JoiValidatorPipe(vAddNewSpending))
    async cAddNewSpending(@Body() body: AddNewSpending, @Res() res: Response) {
        const newSpending = await this.spendingService.createOne(body);
        if (!newSpending)
            return res.status(500).send({
                errorMessage: 'error.internal_server_error for create new spending',
            });
        return res.send({
            message: 'ok',
            data: newSpending,
        });
    }

    @Put('/:id')
    @ApiParam({
        name: 'id',
        example: '963efe1b-8bb3-4d75-a828-c616c91bc886',
        description: 'spending id',
    })
    @ApiOperation({ summary: 'Update existed spending' })
    // @UsePipes(new JoiValidatorPipe(vUpdateSpending))
    async cUpdateSpending(
        @Param('id') id: string,
        @Body() body: UpdateSpending,
        @Res() res: Response,
    ) {
        const { date, description, note, title, value } = body;
        const currentSpending = await this.spendingService.findOne('id', id);
        if (!currentSpending)
            throw new HttpException({ errorMessage: 'error.not_found' }, StatusCodes.BAD_REQUEST);

        currentSpending.date = date || currentSpending.date;
        currentSpending.description = description || currentSpending.description;
        currentSpending.note = note || currentSpending.note;
        currentSpending.title = title || currentSpending.title;
        currentSpending.value = value || currentSpending.value;

        await this.spendingService.updateOne(currentSpending);
        return res.send({
            message: 'ok',
        });
    }
}
