import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, UsersModule, ClientsModule, TransactionsModule, ReportsModule, EmailModule,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'chael',
      password: 'ch@el2007',
      database: 'accounting_db',
      autoLoadEntities: true,
      synchronize: true, // Only for development
    }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
