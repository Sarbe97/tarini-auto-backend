import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PartyService } from './party.service';
import { Party } from './party.schema';

@Controller('party')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Get()
  findAll() {
    console.log('get');
    return this.partyService.findAll();
  }

  @Get('search/:gstn')
  search(@Param('gstn') gstn: string) {
    return this.partyService.findByGstn(gstn);
  }

  @Post()
  create(@Body() party: Party) {
    console.log('Create');
    console.log(party);
    return this.partyService.create(party);
  }
}
