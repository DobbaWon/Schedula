import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Department } from '../../types/database';

export async function getAllDepartments(): Promise<Department[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      DepartmentID    AS departmentId,
      OrganisationID  AS organisationId,
      Name            AS name,
      CoreHoursStart  AS coreHoursStart,
      CoreHoursEnd    AS coreHoursEnd,
      MinimumOfficeDays AS minimumOfficeDays
    FROM Departments
  `);

  return result.recordset;
}

export async function getDepartmentById(departmentId: number): Promise<Department | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('departmentId', sql.Int, departmentId)
    .query(`
      SELECT
        DepartmentID    AS departmentId,
        OrganisationID  AS organisationId,
        Name            AS name,
        CoreHoursStart  AS coreHoursStart,
        CoreHoursEnd    AS coreHoursEnd,
        MinimumOfficeDays AS minimumOfficeDays
      FROM Departments
      WHERE DepartmentID = @departmentId
    `);

  return result.recordset[0] ?? null;
}

export async function createDepartment(department: Omit<Department, 'departmentId'>): Promise<Department> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('organisationId', sql.Int, department.organisationId)
    .input('name', sql.NVarChar, department.name)
    .input('coreHoursStart', sql.Time, department.coreHoursStart)
    .input('coreHoursEnd', sql.Time, department.coreHoursEnd)
    .input('minimumOfficeDays', sql.Int, department.minimumOfficeDays)
    .query(`
      INSERT INTO Departments (
        OrganisationID,
        Name,
        CoreHoursStart,
        CoreHoursEnd,
        MinimumOfficeDays
      )
      OUTPUT INSERTED.DepartmentID AS departmentId
      VALUES (
        @organisationId,
        @name,
        @coreHoursStart,
        @coreHoursEnd,
        @minimumOfficeDays
      )
    `);

  return {
    departmentId: result.recordset[0].departmentId,
    ...department
  };
}

export async function updateDepartment(departmentId: number, department: Partial<Omit<Department, 'departmentId'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('departmentId', sql.Int, departmentId)
    .input('organisationId', sql.Int, department.organisationId ?? null)
    .input('name', sql.NVarChar, department.name ?? null)
    .input('coreHoursStart', sql.Time, department.coreHoursStart ?? null)
    .input('coreHoursEnd', sql.Time, department.coreHoursEnd ?? null)
    .input('minimumOfficeDays', sql.Int, department.minimumOfficeDays ?? null)
    .query(`
      UPDATE Departments
      SET
        OrganisationID = COALESCE(@organisationId, OrganisationID),
        Name = COALESCE(@name, Name),
        CoreHoursStart = @coreHoursStart,
        CoreHoursEnd = @coreHoursEnd,
        MinimumOfficeDays = @minimumOfficeDays
      WHERE DepartmentID = @departmentId
    `);
}

export async function deleteDepartment(departmentId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('departmentId', sql.Int, departmentId)
    .query(`
      DELETE FROM Departments
      WHERE DepartmentID = @departmentId
    `);
}
