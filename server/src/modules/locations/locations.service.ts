import sql from "mssql";
import { poolPromise } from "../../database/db";
import { Location } from "../../types/database";

/**
 * Get all locations for a specific organisation
 */
export async function getAllLocations(
  organisationId: number
): Promise<Location[]> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("organisationId", sql.Int, organisationId)
    .query(`
      SELECT
        LocationID     AS locationId,
        OrganisationID AS organisationId,
        Name           AS name,
        Capacity       AS capacity
      FROM Locations
      WHERE OrganisationID = @organisationId
    `);

  return result.recordset;
}

/**
 * Get a single location by ID (scoped to organisation)
 */
export async function getLocationById(
  locationId: number,
  organisationId: number
): Promise<Location | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("locationId", sql.Int, locationId)
    .input("organisationId", sql.Int, organisationId)
    .query(`
      SELECT
        LocationID     AS locationId,
        OrganisationID AS organisationId,
        Name           AS name,
        Capacity       AS capacity
      FROM Locations
      WHERE LocationID = @locationId
        AND OrganisationID = @organisationId
    `);

  return result.recordset[0] ?? null;
}

/**
 * Create a new location for an organisation
 */
export async function createLocation(
  location: Omit<Location, "locationId">
): Promise<Location> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("organisationId", sql.Int, location.organisationId)
    .input("name", sql.NVarChar, location.name)
    .input("capacity", sql.Int, location.capacity)
    .query(`
      INSERT INTO Locations (OrganisationID, Name, Capacity)
      OUTPUT
        INSERTED.LocationID     AS locationId,
        INSERTED.OrganisationID AS organisationId
      VALUES (@organisationId, @name, @capacity)
    `);

  return {
    locationId: result.recordset[0].locationId,
    organisationId: result.recordset[0].organisationId,
    name: location.name,
    capacity: location.capacity
  };
}

/**
 * Update a location (organisation-safe)
 */
export async function updateLocation(
  locationId: number,
  organisationId: number,
  location: Partial<Omit<Location, "locationId" | "organisationId">>
): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input("locationId", sql.Int, locationId)
    .input("organisationId", sql.Int, organisationId)
    .input("name", sql.NVarChar, location.name ?? null)
    .input("capacity", sql.Int, location.capacity ?? null)
    .query(`
      UPDATE Locations
      SET
        Name = COALESCE(@name, Name),
        Capacity = COALESCE(@capacity, Capacity)
      WHERE LocationID = @locationId
        AND OrganisationID = @organisationId
    `);
}

/**
 * Delete a location (organisation-safe)
 */
export async function deleteLocation(
  locationId: number,
  organisationId: number
): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input("locationId", sql.Int, locationId)
    .input("organisationId", sql.Int, organisationId)
    .query(`
      DELETE FROM Locations
      WHERE LocationID = @locationId
        AND OrganisationID = @organisationId
    `);
}
