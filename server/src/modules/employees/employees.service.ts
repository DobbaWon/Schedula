import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Employee } from '../../types/database';

export async function getAllEmployees(): Promise<Employee[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      EmployeeID     AS employeeId,
      Name           AS name,
      Email          AS email,
      Role           AS role,
      TeamID         AS teamId,
      DepartmentID   AS departmentId,
      CoreHoursStart AS coreHoursStart,
      CoreHoursEnd   AS coreHoursEnd,
      MinimumOfficeDays AS minimumOfficeDays
    FROM Employees
  `);

  return result.recordset;
}

export async function getEmployeeById(employeeId: number): Promise<Employee | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .query(`
      SELECT
        EmployeeID     AS employeeId,
        Name           AS name,
        Email          AS email,
        Role           AS role,
        TeamID         AS teamId,
        DepartmentID   AS departmentId,
        CoreHoursStart AS coreHoursStart,
        CoreHoursEnd   AS coreHoursEnd,
        MinimumOfficeDays AS minimumOfficeDays
      FROM Employees
      WHERE EmployeeID = @employeeId
    `);

  return result.recordset[0] ?? null;
}

export async function createEmployee(
  employee: Omit<Employee, 'employeeId'>
): Promise<Employee> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('name', sql.NVarChar, employee.name)
    .input('email', sql.NVarChar, employee.email)
    .input('role', sql.NVarChar, employee.role)
    .input('teamId', sql.Int, employee.teamId)
    .input('departmentId', sql.Int, employee.departmentId)
    .input('coreHoursStart', sql.Time, employee.coreHoursStart)
    .input('coreHoursEnd', sql.Time, employee.coreHoursEnd)
    .input('minimumOfficeDays', sql.Int, employee.minimumOfficeDays)
    .query(`
      INSERT INTO Employees (
        Name,
        Email,
        Role,
        TeamID,
        DepartmentID,
        CoreHoursStart,
        CoreHoursEnd,
        MinimumOfficeDays
      )
      OUTPUT INSERTED.EmployeeID AS employeeId
      VALUES (
        @name,
        @email,
        @role,
        @teamId,
        @departmentId,
        @coreHoursStart,
        @coreHoursEnd,
        @minimumOfficeDays
      )
    `);

  return {
    employeeId: result.recordset[0].employeeId,
    ...employee
  };
}

export async function updateEmployee(
  employeeId: number,
  employee: Partial<Omit<Employee, 'employeeId'>>
): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .input('name', sql.NVarChar, employee.name ?? null)
    .input('email', sql.NVarChar, employee.email ?? null)
    .input('role', sql.NVarChar, employee.role ?? null)
    .input('teamId', sql.Int, employee.teamId ?? null)
    .input('departmentId', sql.Int, employee.departmentId ?? null)
    .input('coreHoursStart', sql.Time, employee.coreHoursStart ?? null)
    .input('coreHoursEnd', sql.Time, employee.coreHoursEnd ?? null)
    .input('minimumOfficeDays', sql.Int, employee.minimumOfficeDays ?? null)
    .query(`
      UPDATE Employees
      SET
        Name = COALESCE(@name, Name),
        Email = COALESCE(@email, Email),
        Role = COALESCE(@role, Role),
        TeamID = @teamId,
        DepartmentID = COALESCE(@departmentId, DepartmentID),
        CoreHoursStart = @coreHoursStart,
        CoreHoursEnd = @coreHoursEnd,
        MinimumOfficeDays = @minimumOfficeDays
      WHERE EmployeeID = @employeeId
    `);
}

export async function deleteEmployee(employeeId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .query(`
      DELETE FROM Employees
      WHERE EmployeeID = @employeeId
    `);
}
