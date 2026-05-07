import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivityService } from 'src/application/services/src/activity.service';
import { Activity } from 'src/infrastructure/models/activity.model';
import { CreateActivityDto } from 'src/presentation/dtos/activity/create-activity.dto';
import { PartialType } from '@nestjs/swagger';

class UpdateActivityDto extends PartialType(CreateActivityDto) {}

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Post()
  create(@Body() data: CreateActivityDto): Promise<Activity> {
    return this.activityService.create(data);
  }

  @Get(':activityId/fundings')
  findFundings(@Param('activityId') activityId: string) {
    return this.activityService.findFundingsByActivity(activityId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateActivityDto,
  ): Promise<Activity | null> {
    return this.activityService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<boolean> {
    return this.activityService.delete(id);
  }
}

@Controller('fundings/:fundingId/activities')
export class FundingActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll(@Param('fundingId') fundingId: string): Promise<Activity[]> {
    return this.activityService.findByFunding(fundingId);
  }

  @Post()
  createAndLink(
    @Param('fundingId') fundingId: string,
    @Body() data: CreateActivityDto,
  ): Promise<Activity> {
    return this.activityService.createAndLink(data, fundingId);
  }

  @Post(':activityId/link')
  @HttpCode(HttpStatus.NO_CONTENT)
  link(
    @Param('fundingId') fundingId: string,
    @Param('activityId') activityId: string,
  ): Promise<void> {
    return this.activityService.linkToFunding(activityId, fundingId);
  }

  @Delete(':activityId/link')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlink(
    @Param('fundingId') fundingId: string,
    @Param('activityId') activityId: string,
  ): Promise<void> {
    return this.activityService.unlinkFromFunding(activityId, fundingId);
  }
}
