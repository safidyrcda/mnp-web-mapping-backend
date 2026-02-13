/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

interface Row {
  ap_id: string;
  geometry: string;
}

interface Feature {
  type: 'Feature';
  geometry: Record<string, unknown>;
  properties: {
    ap_id: string;
  };
}

@Controller('data')
export class AppController {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  @Get()
  async getData() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result: QueryResult<Row> = await this.pool.query(`
      SELECT  sigle, ST_AsGeoJSON(geometry) AS geometry
      FROM public."protected_area"
      LIMIT 50;
    `);

    const features: Feature[] = (result.rows as Row[]).map((r) => ({
      type: 'Feature',
      geometry: JSON.parse(r.geometry) as Record<string, unknown>,
      properties: {
        ap_id: r.ap_id,
      },
    }));

    return { type: 'FeatureCollection', features };
  }
}
