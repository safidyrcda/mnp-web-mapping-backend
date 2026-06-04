import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { ProtectedArea } from 'src/infrastructure/models/protected-area.model';

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
      status,
      superficie,
      "creationYear",
      regions,
      districts,
      communes,
      "populationCount",
      "femaleClpNumber",
      "maleClpNumber",
      ST_Area(geometry::geography) / 10000 AS size
    FROM public."protected_area"
    LIMIT 50;
  `);

    return result;
  }

  async findDetailById(id: string) {
    const result = await this.dataSource.query(
      `
    SELECT
      pa.id,
      pa.sigle,
      pa.name,
      pa.status,
      ST_Area(pa.geometry::geography) / 10000 AS size
    FROM public."protected_area" pa
    WHERE pa.id = $1
    LIMIT 1;
    `,
      [id],
    );

    if (!result[0]) return null;

    // Tous les fundings liés à cette AP via protected_area_funding
    const fundings = await this.dataSource.query(
      `
    SELECT
      f.id,
      f.name,
      f.debut,
      f.end,
      f.amount,
      f.currency,
      f."amountInEuro" AS "amountInEuro",

      -- Somme des décaissements
      COALESCE(SUM(d.amount), 0)          AS "totalDisbursed",
      COALESCE(SUM(d."amountInEuro"), 0)  AS "totalDisbursedEuro",

      -- Bailleurs (agrégés en JSON)
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', fu.id, 'name', fu.name, 'fullname', fu.fullname))
        FILTER (WHERE fu.id IS NOT NULL),
        '[]'
      ) AS funders,

      -- Autres APs concernées par ce même funding
      COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', pa2.id, 'sigle', pa2.sigle, 'name', pa2.name))
        FILTER (WHERE pa2.id IS NOT NULL AND pa2.id != $1),
        '[]'
      ) AS "otherProtectedAreas"

    FROM public."protected_area_funding" paf
    JOIN public."funding" f ON f.id = paf."fundingId"
    LEFT JOIN public."disbursement" d ON d."fundingId" = f.id
    LEFT JOIN public."funder_funding" ff ON ff."fundingId" = f.id
    LEFT JOIN public."funder" fu ON fu.id = ff."funderId"
    LEFT JOIN public."protected_area_funding" paf2 ON paf2."fundingId" = f.id
    LEFT JOIN public."protected_area" pa2 ON pa2.id = paf2."protectedAreaId"
    WHERE paf."protectedAreaId" = $1
    GROUP BY f.id, f.name, f.debut, f.end, f.amount, f.currency, f."amountInEuro"
    ORDER BY f.debut ASC NULLS LAST;
    `,
      [id],
    );

    return {
      ...result[0],
      fundings,
    };
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

  async update(
    id: string,
    data: Partial<ProtectedArea>,
  ): Promise<ProtectedArea | null> {
    await this.dataSource.getRepository(ProtectedArea).update({ id }, data);
    return this.dataSource.getRepository(ProtectedArea).findOneBy({ id });
  }
}
