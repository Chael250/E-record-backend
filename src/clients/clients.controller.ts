import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-guard.guard';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.clientsService.findById(id);
  }

  @Post()
  async create(@Body() clientData: any) {
    return this.clientsService.create(clientData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: any) {
    return this.clientsService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.clientsService.delete(id);
  }
}
