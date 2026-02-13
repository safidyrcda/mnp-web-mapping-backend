import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedArea } from 'src/models/protected-area.model';

@Injectable()
export class ProtectedAreaRepository extends BaseRepository<ProtectedArea> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProtectedArea);
  }

  async findAllGeoJSON() {
    const result = await this.dataSource.query(`
      SELECT
        id,
        sigle,
        ST_AsGeoJSON(
          ST_Simplify(geometry, 0.01)
        )::json AS geometry
      FROM public."protected_area"
      LIMIT 50;
    `);

    const features = result.map((r: any) => ({
      type: 'Feature',
      geometry: r.geometry,
      properties: {
        sigle: r.sigle,
        id: r.id,
      },
    }));

    return { type: 'FeatureCollection', features };
  }

  async findOneAPGeometry(id: string) {
    const result = await this.dataSource.query(
      `
    SELECT
      id,
      sigle,
      ST_AsGeoJSON(geometry) AS geometry
    FROM public."protected_area"
    WHERE id = $1
    LIMIT 1;
    `,
      [id],
    );

    const row = result[0];

    console.log('Row:', row);

    const feature = {
      type: 'Feature',
      geometry: JSON.parse(row.geometry),
      properties: {
        sigle: row.sigle,
        id: row.id,
      },
    };

    return feature;
  }
}
