import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ActivityService } from 'src/application/services/src/activity.service';
import { Activity } from 'src/infrastructure/models/activity.model';
import { CreateActivityDto } from 'src/presentation/dtos/activity/create-activity.dto';

// ── Ressource standalone : /activities ───────────────────────────────────────
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // Lister toutes les activités (sans filtre)
  @Get()
  findAll(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  // Créer une activité standalone (sans la lier immédiatement à un funding)
  @Post()
  create(@Body() data: CreateActivityDto): Promise<Activity> {
    return this.activityService.create(data);
  }

  // Tous les financements liés à une activité (inverse de la jointure)
  @Get(':activityId/fundings')
  findFundings(@Param('activityId') activityId: string) {
    return this.activityService.findFundingsByActivity(activityId);
  }

  // Supprimer une activité (et ses liaisons via cascade)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.activityService.delete(id);
  }
}

// ── Sous-ressource : /fundings/:fundingId/activities ─────────────────────────
@Controller('fundings/:fundingId/activities')
export class FundingActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // Toutes les activités liées à un funding donné
  @Get()
  findAll(@Param('fundingId') fundingId: string): Promise<Activity[]> {
    return this.activityService.findByFunding(fundingId);
  }

  // Créer une nouvelle activité ET la lier à ce funding en une seule requête
  @Post()
  createAndLink(
    @Param('fundingId') fundingId: string,
    @Body() data: CreateActivityDto,
  ): Promise<Activity> {
    return this.activityService.createAndLink(data, fundingId);
  }

  // Lier une activité EXISTANTE à ce funding : POST /fundings/:fundingId/activities/:activityId/link
  @Post(':activityId/link')
  @HttpCode(HttpStatus.NO_CONTENT)
  link(
    @Param('fundingId') fundingId: string,
    @Param('activityId') activityId: string,
  ): Promise<void> {
    return this.activityService.linkToFunding(activityId, fundingId);
  }

  // Délier une activité de ce funding sans la supprimer : DELETE /fundings/:fundingId/activities/:activityId/link
  @Delete(':activityId/link')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlink(
    @Param('fundingId') fundingId: string,
    @Param('activityId') activityId: string,
  ): Promise<void> {
    return this.activityService.unlinkFromFunding(activityId, fundingId);
  }
}
