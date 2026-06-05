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
      pa.superficie,
      pa."creationYear",
      pa.regions,
      pa.districts,
      pa.communes,
      pa."populationCount",
      pa."femaleClpNumber",
      pa."maleClpNumber",
      ST_Area(pa.geometry::geography) / 10000 AS size
    FROM public."protected_area" pa
    WHERE pa.id = $1
    LIMIT 1;
    `,
      [id],
    );

    if (!result[0]) return null;

    const fundings = await this.dataSource.query(
      `
    SELECT
      f.id,
      f.name,
      f.debut,
      f.end,
      f.amount         AS "globalAmount",
      f.currency       AS "globalCurrency",
      f."amountInEuro" AS "globalAmountInEuro",

      paf.amount          AS "paAmount",
      paf.currency        AS "paCurrency",
      paf."amountInEuro"  AS "paAmountInEuro",

      COALESCE((
        SELECT SUM(d.amount)
        FROM public."disbursement" d
        WHERE d."fundingId" = f.id
      ), 0) AS "totalDisbursed",

      COALESCE((
        SELECT SUM(d."amountInEuro")
        FROM public."disbursement" d
        WHERE d."fundingId" = f.id
      ), 0) AS "totalDisbursedEuro",

      -- Bailleurs avec type, sans doublon
      (
        SELECT COALESCE(JSON_AGG(sub), '[]')
        FROM (
          SELECT DISTINCT fu.id, fu.name, fu.fullname, ff.type
          FROM public."funder_funding" ff
          JOIN public."funder" fu ON fu.id = ff."funderId"
          WHERE ff."fundingId" = f.id
        ) sub
      ) AS funders,

      -- Activités liées à ce financement
      (
        SELECT COALESCE(JSON_AGG(sub ORDER BY sub.title), '[]')
        FROM (
          SELECT DISTINCT a.id, a.title, a.description
          FROM public."activity_funding" af
          JOIN public."activity" a ON a.id = af."activityId"
          WHERE af."fundingId" = f.id
        ) sub
      ) AS activities,

      -- Autres APs liées au même funding
      (
        SELECT COALESCE(JSON_AGG(sub), '[]')
        FROM (
          SELECT DISTINCT pa2.id, pa2.sigle, pa2.name
          FROM public."protected_area_funding" paf2
          JOIN public."protected_area" pa2 ON pa2.id = paf2."protectedAreaId"
          WHERE paf2."fundingId" = f.id AND pa2.id != $1
        ) sub
      ) AS "otherProtectedAreas"

    FROM public."protected_area_funding" paf
    JOIN public."funding" f ON f.id = paf."fundingId"
    WHERE paf."protectedAreaId" = $1
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
      superficie,
      "creationYear",
      regions,
      districts,
      communes,
      "populationCount",
      "femaleClpNumber",
      "maleClpNumber",
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
