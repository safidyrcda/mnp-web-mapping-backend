import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedArea } from 'src/models/protected-area.model';

@Injectable()
export class ProtectedAreaRepository extends BaseRepository<ProtectedArea> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProtectedArea);
  }

  async find() {
    const result = await this.dataSource.query(`
      SELECT
        id,
        sigle,
        name,
        status
      FROM public."protected_area"
      LIMIT 50;
    `);

    return result;
  }

  async findOneBySigle(sigle: string) {
    return await this.dataSource
      .getRepository(ProtectedArea)
      .findOneBy({ sigle });
  }

  async findAllGeoJSON() {
    const result = await this.dataSource.query(`
      SELECT
        id,
        sigle,
        name,
        status,
        ST_Area(geometry::geography) / 10000 AS size,
        ST_AsGeoJSON(
        ST_Transform(
          ST_SimplifyPreserveTopology(
            ST_Transform(geometry, 3857),
            1000
          ),
          4326
        ))::json AS geometry
      FROM public."protected_area"
      LIMIT 50;
    `);

    const features = result.map((r: any) => ({
      type: 'Feature',
      geometry: r.geometry,
      properties: {
        sigle: r.sigle,
        id: r.id,
        name: r.name,
        status: r.status,
        size: r.size,
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
      name,
      status,
      ST_AsGeoJSON(geometry) AS geometry,
      ST_Area(geometry::geography) / 10000 AS size 
    FROM public."protected_area"
    WHERE id = $1
    LIMIT 1;
    `,
      [id],
    );

    const row = result[0];

    if (!row) {
      return null;
    }

    const feature = {
      type: 'Feature',
      geometry: JSON.parse(row.geometry),
      properties: {
        sigle: row.sigle,
        id: row.id,
        name: row.name,
        status: row.status,
        size: row.size,
      },
    };

    return feature;
  }
}
