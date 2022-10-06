import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SpendingService } from './spending.service';

@Controller('spendings')
@ApiTags('Spendings')
@ApiBearerAuth()
// @UseGuards(AuthGuard)
export class SpendingsController {
    constructor(private readonly spendingService: SpendingService) {}

    @Get('/')
    async cGetOneById(@Param('id') id: string, @Res() res: Response) {
        const spending = await this.spendingService.getSpendingListWithCount();

        return res.send(spending);
    }
}
