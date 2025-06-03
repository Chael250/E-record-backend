import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class ReportsService {
  constructor(
    private transactionsService: TransactionsService,
    private clientsService: ClientsService,
  ) {}

  async getDashboardData() {
    const [financialSummary, clients, transactions] = await Promise.all([
      this.transactionsService.getFinancialSummary(),
      this.clientsService.findAll(),
      this.transactionsService.findAll(),
    ]);

    return {
      summary: financialSummary,
      totalClients: clients.length,
      recentTransactions: transactions.slice(-10),
      monthlyData: this.getMonthlyData(transactions),
    };
  }

  private getMonthlyData(transactions: any[]) {
    const monthlyData = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === 'income') {
        monthlyData[month].income += Number(transaction.amount);
      } else {
        monthlyData[month].expenses += Number(transaction.amount);
      }
    });
    return monthlyData;
  }
}
