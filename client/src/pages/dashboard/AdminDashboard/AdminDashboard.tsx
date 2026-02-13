import Styles from '../Dashboard.module.css';
import { adminHook } from '../../../api/dashboard/admin/adminHook';
import type { Organisation } from '../../../types/database';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const useAdmin = adminHook();
  const [organisation, setOrganisation] = useState<Organisation | null>(null);

  useEffect(() => {
    async function fetchOrganisation() {
      const org = await useAdmin.getOrganisation();
      setOrganisation(org);
    }
    fetchOrganisation();
  }, []);

  const formatTime = (timeString: string) => {
    // If timeString is like "1970-01-01T09:00" or "09:00:00"
    const match = timeString.match(/(\d{2}:\d{2})/);
    return match ? match[1] : timeString;
  };

  if (!organisation) return <div>Loading...</div>;
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Features:</h2>
      <ul>
        <li>
          <p>Creating Organisations</p>
        </li>
        <li>
          <p>Defining Locations and Office Capacity</p>
        </li>
        <li>
          <p>Creating Departments and Teams</p>
        </li>
        <li>
          <p>Assigning Employees and Managers</p>
        </li>
        <li>
          <p>Defining Work Arrangements and Scheduling Policies</p>
        </li>                                
      </ul>

      <h2>Your Organisation</h2>
      <ul>
        <li>
          <p>Name: {organisation.name}</p>
        </li>
        <li>
          <p>
            Hours: {formatTime(organisation.coreHoursStart)} - {formatTime(organisation.coreHoursEnd)}
          </p>
        </li>
        <li>
          <p>Work Time Control Policy: {organisation.workTimeControlPolicy}</p>
        </li>
        <li>
          <p>Working Arrangements: {organisation.workArrangements}</p>
        </li>
        <li>
          <p>Minimum Office Days: {organisation.minimumOfficeDays}</p>
        </li>                                      
      </ul>
    </div>
  );
}