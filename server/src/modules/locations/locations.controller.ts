import { Request, Response } from "express";
import * as locationService from "./locations.service";

export async function getLocations(req: Request, res: Response) {
  const organisationId = req.body.organisationId;

  const locations = await locationService.getAllLocations(organisationId);
  res.json(locations);
}

export async function getLocation(req: Request, res: Response) {
  const organisationId = req.body.organisationId;
  const locationId = Number(req.params.id);

  const location = await locationService.getLocationById(
    locationId,
    organisationId
  );

  if (!location) {
    res.status(404).json({ message: "Location not found" });
    return;
  }

  res.json(location);
}

export async function createLocation(req: Request, res: Response) {
  const organisationId = req.body.organisationId;

  const location = await locationService.createLocation({
    ...req.body,
    organisationId
  });

  res.status(201).json(location);
}

export async function updateLocation(req: Request, res: Response) {
  const organisationId = req.body.organisationId;
  const locationId = Number(req.params.id);

  await locationService.updateLocation(
    locationId,
    organisationId,
    req.body
  );

  res.status(204).send();
}

export async function deleteLocation(req: Request, res: Response) {
  const organisationId = req.body.organisationId;
  const locationId = Number(req.params.id);

  await locationService.deleteLocation(
    locationId,
    organisationId
  );

  res.status(204).send();
}
