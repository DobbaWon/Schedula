import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Location } from '../../types/database';

export async function getAllLocations(): Promise<Location[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      LocationID AS locationId,
      Name       AS name,
      Capacity   AS capacity
    FROM Locations
  `);

  return result.recordset;
}

export async function getLocationById(locationId: number): Promise<Location | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('locationId', sql.Int, locationId)
    .query(`
      SELECT
        LocationID AS locationId,
        Name       AS name,
        Capacity   AS capacity
      FROM Locations
      WHERE LocationID = @locationId
    `);

  return result.recordset[0] ?? null;
}

export async function createLocation(location: Omit<Location, 'locationId'>): Promise<Location> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('name', sql.NVarChar, location.name)
    .input('capacity', sql.Int, location.capacity)
    .query(`
      INSERT INTO Locations (Name, Capacity)
      OUTPUT INSERTED.LocationID AS locationId
      VALUES (@name, @capacity)
    `);

  return {
    locationId: result.recordset[0].locationId,
    ...location
  };
}

export async function updateLocation(locationId: number, location: Partial<Omit<Location, 'locationId'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('locationId', sql.Int, locationId)
    .input('name', sql.NVarChar, location.name ?? null)
    .input('capacity', sql.Int, location.capacity ?? null)
    .query(`
      UPDATE Locations
      SET
        Name = COALESCE(@name, Name),
        Capacity = COALESCE(@capacity, Capacity)
      WHERE LocationID = @locationId
    `);
}

export async function deleteLocation(locationId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('locationId', sql.Int, locationId)
    .query(`
      DELETE FROM Locations
      WHERE LocationID = @locationId
    `);
}
