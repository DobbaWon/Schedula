import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Organisation } from '../../types/database';

export async function getAllOrganisations(): Promise<Organisation[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      OrganisationID           AS organisationId,
      Name                     AS name,
      WorkArrangements         AS workArrangements,
      WorkTimeControlPolicy    AS workTimeControlPolicy,
      CoreHoursStart           AS coreHoursStart,
      CoreHoursEnd             AS coreHoursEnd,
      MinimumOfficeDays        AS minimumOfficeDays
    FROM Organisations
  `);

  return result.recordset;
}

export async function getOrganisationById(organisationId: number): Promise<Organisation | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('organisationId', sql.Int, organisationId)
    .query(`
      SELECT
        OrganisationID           AS organisationId,
        Name                     AS name,
        WorkArrangements         AS workArrangements,
        WorkTimeControlPolicy    AS workTimeControlPolicy,
        CoreHoursStart           AS coreHoursStart,
        CoreHoursEnd             AS coreHoursEnd,
        MinimumOfficeDays        AS minimumOfficeDays
      FROM Organisations
      WHERE OrganisationID = @organisationId
    `);

  return result.recordset[0] ?? null;
}

export async function createOrganisation(org: Omit<Organisation, 'organisationId'>): Promise<Organisation> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('name', sql.NVarChar, org.name)
    .input('workArrangements', sql.NVarChar, org.workArrangements)
    .input('workTimeControlPolicy', sql.NVarChar, org.workTimeControlPolicy)
    .input('coreHoursStart', sql.Time, org.coreHoursStart)
    .input('coreHoursEnd', sql.Time, org.coreHoursEnd)
    .input('minimumOfficeDays', sql.Int, org.minimumOfficeDays)
    .query(`
      INSERT INTO Organisations (
        Name,
        WorkArrangements,
        WorkTimeControlPolicy,
        CoreHoursStart,
        CoreHoursEnd,
        MinimumOfficeDays
      )
      OUTPUT INSERTED.OrganisationID AS organisationId
      VALUES (
        @name,
        @workArrangements,
        @workTimeControlPolicy,
        @coreHoursStart,
        @coreHoursEnd,
        @minimumOfficeDays
      )
    `);

  return {
    organisationId: result.recordset[0].organisationId,
    ...org
  };
}

export async function updateOrganisation(
  organisationId: number,
  org: Partial<Omit<Organisation, 'organisationId'>>
): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('organisationId', sql.Int, organisationId)
    .input('name', sql.NVarChar, org.name ?? null)
    .input('workArrangements', sql.NVarChar, org.workArrangements ?? null)
    .input('workTimeControlPolicy', sql.NVarChar, org.workTimeControlPolicy ?? null)
    .input('coreHoursStart', sql.Time, org.coreHoursStart ?? null)
    .input('coreHoursEnd', sql.Time, org.coreHoursEnd ?? null)
    .input('minimumOfficeDays', sql.Int, org.minimumOfficeDays ?? null)
    .query(`
      UPDATE Organisations
      SET
        Name = COALESCE(@name, Name),
        WorkArrangements = COALESCE(@workArrangements, WorkArrangements),
        WorkTimeControlPolicy = COALESCE(@workTimeControlPolicy, WorkTimeControlPolicy),
        CoreHoursStart = @coreHoursStart,
        CoreHoursEnd = @coreHoursEnd,
        MinimumOfficeDays = @minimumOfficeDays
      WHERE OrganisationID = @organisationId
    `);
}

export async function deleteOrganisation(organisationId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('organisationId', sql.Int, organisationId)
    .query(`
      DELETE FROM Organisations
      WHERE OrganisationID = @organisationId
    `);
}
