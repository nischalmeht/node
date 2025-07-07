import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Controller('destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
    constructor(private readonly destinationsService: DestinationsService) { }
    @Post()
    create(@Request() req, @Body() createDestinationDto: CreateDestinationDto) {
        return this.destinationsService.create(
            req.user.userId,
            createDestinationDto,
        );
    }
    @Get()
    findAll(@Request() req) {
        return this.destinationsService.findAll(req.user.userId);
    }
    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.destinationsService.findOne(req.user.userId, +id);
    }
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
      return this.destinationsService.removeDestination(req.user.userId, +id);
    }
}
