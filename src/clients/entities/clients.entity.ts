import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Transaction, transaction => transaction.client)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}