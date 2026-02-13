import { apiRequest } from "../../apiHelper";
import type { Organisation } from "../../../types/database";

export function adminHook() {

  async function getOrganisation(organisationID?: number, organisationName?: string) : Promise<Organisation | null> {
    const path = 
    organisationID ? `/organisations/${organisationID}` 
    : organisationName ? `/organisations/name/${organisationName}` 
    : "/organisations/1";

    try {
      const organisation : Organisation = await apiRequest(path, "GET")

      return organisation
    } catch (err) {
      console.error("An error occurred: " + err);
      return null;
    }
  }
    
  return({
    getOrganisation,  
  })
}