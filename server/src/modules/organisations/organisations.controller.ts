import { Request, Response } from 'express';
import * as organisationService from './organisations.service';

export async function getOrganisations(_req: Request, res: Response) {
  const organisations = await organisationService.getAllOrganisations();
  res.json(organisations);
}

export async function getOrganisation(req: Request, res: Response) {
  const organisationId = Number(req.params.id);
  const org = await organisationService.getOrganisationById(organisationId);

  if (!org) {
    res.status(404).json({ message: 'Organisation not found' });
    return;
  }

  res.json(org);
}

export async function getOrganisationByName(req: Request, res: Response) {
  const organisationName = String(req.params.name);
  const org = await organisationService.getOrganisationByName(organisationName);

  if (!org) {
    res.status(404).json({ message: 'Organisation not found' });
    return;
  }

  res.json(org);
}

export async function createOrganisation(req: Request, res: Response) {
  const org = await organisationService.createOrganisation(req.body);
  res.status(201).json(org);
}

export async function updateOrganisation(req: Request, res: Response) {
  const organisationId = Number(req.params.id);
  try {
    await organisationService.updateOrganisation(organisationId, req.body);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update organisation' });
  }
}

export async function deleteOrganisation(req: Request, res: Response) {
  const organisationId = Number(req.params.id);
  await organisationService.deleteOrganisation(organisationId);
  res.status(204).send();
}
