import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Team } from '../../types/database';

export async function getAllTeams(): Promise<Team[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      TeamID       AS teamId,
      Name         AS name,
      DepartmentID AS departmentId,
      ManagerID    AS managerId,
      CoreHoursStart AS coreHoursStart,
      CoreHoursEnd   AS coreHoursEnd,
      MinimumOfficeDays AS minimumOfficeDays
    FROM Teams
  `);

  return result.recordset;
}

export async function getTeamById(teamId: number): Promise<Team | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('teamId', sql.Int, teamId)
    .query(`
      SELECT
        TeamID       AS teamId,
        Name         AS name,
        DepartmentID AS departmentId,
        ManagerID    AS managerId,
        CoreHoursStart AS coreHoursStart,
        CoreHoursEnd   AS coreHoursEnd,
        MinimumOfficeDays AS minimumOfficeDays
      FROM Teams
      WHERE TeamID = @teamId
    `);

  return result.recordset[0] ?? null;
}

export async function createTeam(team: Omit<Team, 'teamId'>): Promise<Team> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('name', sql.NVarChar, team.name)
    .input('departmentId', sql.Int, team.departmentId)
    .input('managerId', sql.Int, team.managerId)
    .input('coreHoursStart', sql.Time, team.coreHoursStart)
    .input('coreHoursEnd', sql.Time, team.coreHoursEnd)
    .input('minimumOfficeDays', sql.Int, team.minimumOfficeDays)
    .query(`
      INSERT INTO Teams (
        Name,
        DepartmentID,
        ManagerID,
        CoreHoursStart,
        CoreHoursEnd,
        MinimumOfficeDays
      )
      OUTPUT INSERTED.TeamID AS teamId
      VALUES (
        @name,
        @departmentId,
        @managerId,
        @coreHoursStart,
        @coreHoursEnd,
        @minimumOfficeDays
      )
    `);

  return {
    teamId: result.recordset[0].teamId,
    ...team
  };
}

export async function updateTeam(teamId: number, team: Partial<Omit<Team, 'teamId'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('teamId', sql.Int, teamId)
    .input('name', sql.NVarChar, team.name ?? null)
    .input('departmentId', sql.Int, team.departmentId ?? null)
    .input('managerId', sql.Int, team.managerId ?? null)
    .input('coreHoursStart', sql.Time, team.coreHoursStart ?? null)
    .input('coreHoursEnd', sql.Time, team.coreHoursEnd ?? null)
    .input('minimumOfficeDays', sql.Int, team.minimumOfficeDays ?? null)
    .query(`
      UPDATE Teams
      SET
        Name = COALESCE(@name, Name),
        DepartmentID = COALESCE(@departmentId, DepartmentID),
        ManagerID = @managerId,
        CoreHoursStart = @coreHoursStart,
        CoreHoursEnd = @coreHoursEnd,
        MinimumOfficeDays = @minimumOfficeDays
      WHERE TeamID = @teamId
    `);
}

export async function deleteTeam(teamId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('teamId', sql.Int, teamId)
    .query(`
      DELETE FROM Teams
      WHERE TeamID = @teamId
    `);
}
