import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { AuthProviderRecord } from '../../types/database';

export async function getAllAuthProviders(): Promise<AuthProviderRecord[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      EmployeeID         AS employeeId,
      Provider           AS provider,
      ProviderUserID     AS providerUserId,
      ProfilePictureURL  AS profilePictureUrl,
      ProviderEmail      AS providerEmail,
      ProviderDisplayName AS providerDisplayName
    FROM AuthProviders
  `);

  return result.recordset;
}

export async function getAuthProvider(employeeId: number, provider: string): Promise<AuthProviderRecord | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .input('provider', sql.NVarChar, provider)
    .query(`
      SELECT
        EmployeeID         AS employeeId,
        Provider           AS provider,
        ProviderUserID     AS providerUserId,
        ProfilePictureURL  AS profilePictureUrl,
        ProviderEmail      AS providerEmail,
        ProviderDisplayName AS providerDisplayName
      FROM AuthProviders
      WHERE EmployeeID = @employeeId AND Provider = @provider
    `);

  return result.recordset[0] ?? null;
}

export async function createAuthProvider(authProvider: AuthProviderRecord): Promise<AuthProviderRecord> {
  const pool = await poolPromise;

  await pool.request()
    .input('employeeId', sql.Int, authProvider.employeeId)
    .input('provider', sql.NVarChar, authProvider.provider)
    .input('providerUserId', sql.NVarChar, authProvider.providerUserId)
    .input('profilePictureUrl', sql.NVarChar, authProvider.profilePictureUrl ?? null)
    .input('providerEmail', sql.NVarChar, authProvider.providerEmail)
    .input('providerDisplayName', sql.NVarChar, authProvider.providerDisplayName)
    .query(`
      INSERT INTO AuthProviders (
        EmployeeID,
        Provider,
        ProviderUserID,
        ProfilePictureURL,
        ProviderEmail,
        ProviderDisplayName
      )
      VALUES (
        @employeeId,
        @provider,
        @providerUserId,
        @profilePictureUrl,
        @providerEmail,
        @providerDisplayName
      )
    `);

  return authProvider;
}

export async function updateAuthProvider(employeeId: number, provider: string, authProvider: Partial<Omit<AuthProviderRecord, 'employeeId' | 'provider'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .input('provider', sql.NVarChar, provider)
    .input('providerUserId', sql.NVarChar, authProvider.providerUserId ?? null)
    .input('profilePictureUrl', sql.NVarChar, authProvider.profilePictureUrl ?? null)
    .input('providerEmail', sql.NVarChar, authProvider.providerEmail ?? null)
    .input('providerDisplayName', sql.NVarChar, authProvider.providerDisplayName ?? null)
    .query(`
      UPDATE AuthProviders
      SET
        ProviderUserID     = COALESCE(@providerUserId, ProviderUserID),
        ProfilePictureURL  = @profilePictureUrl,
        ProviderEmail      = COALESCE(@providerEmail, ProviderEmail),
        ProviderDisplayName = COALESCE(@providerDisplayName, ProviderDisplayName)
      WHERE EmployeeID = @employeeId AND Provider = @provider
    `);
}

export async function deleteAuthProvider(employeeId: number, provider: string): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('employeeId', sql.Int, employeeId)
    .input('provider', sql.NVarChar, provider)
    .query(`
      DELETE FROM AuthProviders
      WHERE EmployeeID = @employeeId AND Provider = @provider
    `);
}
