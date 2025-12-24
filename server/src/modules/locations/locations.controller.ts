import { Request, Response } from 'express';
import * as locationService from './locations.service';

export async function getLocations(_req: Request, res: Response) {
  const locations = await locationService.getAllLocations();
  res.json(locations);
}

export async function getLocation(req: Request, res: Response) {
  const locationId = Number(req.params.id);
  const location = await locationService.getLocationById(locationId);

  if (!location) {
    res.status(404).json({ message: 'Location not found' });
    return;
  }

  res.json(location);
}

export async function createLocation(req: Request, res: Response) {
  const location = await locationService.createLocation(req.body);
  res.status(201).json(location);
}

export async function updateLocation(req: Request, res: Response) {
  const locationId = Number(req.params.id);
  await locationService.updateLocation(locationId, req.body);
  res.status(204).send();
}

export async function deleteLocation(req: Request, res: Response) {
  const locationId = Number(req.params.id);
  await locationService.deleteLocation(locationId);
  res.status(204).send();
}
