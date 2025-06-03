import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.find({ relations: ['client'] });
  }

  async findByClient(clientId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({ 
      where: { clientId },
      relations: ['client'] 
    });
  }

  async getFinancialSummary() {
    const transactions = await this.transactionsRepository.find();
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }
}