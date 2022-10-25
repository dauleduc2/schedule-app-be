import { Controller, Get, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryJoiValidatorPipe } from 'src/core/pipe/queryValidator.pipe';
import { FilterSpendingsDTO, vFilterSpendingDTO } from './dto/filterSpending';
import { SpendingService } from './spending.service';

@Controller('spendings')
@ApiTags('Spendings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class SpendingsController {
    constructor(private readonly spendingService: SpendingService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSpendingDTO))
    async cGetOneById(
        @Query() queries: FilterSpendingsDTO,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const {
            title,
            value,
            note,
            description,
            type,
            fromDate,
            toDate,
            currentPage,
            order,
            pageSize,
        } = queries;

        const spending = await this.spendingService.getSpendingListWithCount({
            where: {
                date: {
                    fromDate: fromDate,
                    toDate: toDate,
                },
                description,
                note,
                title,
                value,
                owner: req.user.id,
                type,
            },
            order: order,
            skip: currentPage * pageSize,
            take: pageSize,
        });

        return res.send({
            data: spending[0],
            total: spending[1],
        });
    }
}
