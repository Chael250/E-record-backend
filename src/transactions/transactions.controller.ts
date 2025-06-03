import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  async findAll() {
    return this.transactionsService.findAll();
  }

  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: number) {
    return this.transactionsService.findByClient(clientId);
  }

  @Get('summary')
  async getFinancialSummary() {
    return this.transactionsService.getFinancialSummary();
  }

  @Post()
  async create(@Body() transactionData: any) {
    return this.transactionsService.create(transactionData);
  }
}

