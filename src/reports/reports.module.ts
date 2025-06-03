import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ClientsService } from 'src/clients/clients.service';
import { Client } from 'src/clients/entities/clients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Client])],
  providers: [ReportsService, TransactionsService, ClientsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
