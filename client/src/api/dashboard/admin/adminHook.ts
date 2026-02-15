import { apiRequest } from "../../apiHelper";
import type { Organisation } from "../../../types/database";

export function adminHook() {

  async function getOrganisation(organisationID?: number, organisationName?: string) : Promise<Organisation | null> {
    const path = 
    organisationID ? `/organisations/${organisationID}` 
    : organisationName ? `/organisations/name/${organisationName}` 
    : "/organisations/1";

    try {
      const organisation: Organisation | null = await apiRequest(path, "GET")

      return organisation
    } catch (err) {
      console.error("An error occurred: " + err);
      return null;
    }
  }

  async function updateOrganisation(
    organisationID: number,
    updatedOrg: Omit<Organisation, "organisationId">
  ): Promise<boolean> {
    try {
      await apiRequest(`/organisations/${organisationID}`, "PUT", updatedOrg);
      return true;
    } catch (err) {
      console.error("Failed to update organisation: " + err);
      return false;
    }
  }
    
  return({
    getOrganisation,
    updateOrganisation,  
  })
}