import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/clients.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(clientData: Partial<Client>): Promise<Client> {
    const client = this.clientsRepository.create(clientData);
    return this.clientsRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find({ relations: ['transactions'] });
  }

  async findById(id: number): Promise<Client | null> {
    return this.clientsRepository.findOne({ 
      where: { id }, 
      relations: ['transactions'] 
    });
  }

  async update(id: number, updateData: Partial<Client>): Promise<Client | null> {
    await this.clientsRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}
