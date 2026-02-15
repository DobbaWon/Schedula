import Styles from "../Dashboard.module.css";
import { adminHook } from "../../../api/dashboard/admin/adminHook";
import type { Organisation } from "../../../types/database";
import type { WorkArrangement, WorkTimeControlPolicy } from "../../../types/enums";

import { useEffect, useState } from "react";

type EditableSection = "policies" | null;

export default function AdminDashboard() {
  const useAdmin = adminHook();
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [draftOrganisation, setDraftOrganisation] = useState<Organisation | null>(null);
  const [editing, setEditing] = useState<EditableSection>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchOrganisation() {
      const org = await useAdmin.getOrganisation();
      setOrganisation(org);
      setDraftOrganisation(org);
    }
    fetchOrganisation();
  }, []);

  const formatTime = (timeString: string) => {
    const match = timeString.match(/(\d{2}:\d{2})/);
    return match ? match[1] : timeString;
  };

  const timeToEpochISOString = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));
    return date.toISOString();
  };


  const startEditing = (section: EditableSection) => {
    setDraftOrganisation(organisation);
    setEditing(section);
  };

  const cancelEditing = () => {
    setDraftOrganisation(organisation);
    setEditing(null);
  };

  const saveEditing = async () => {
    if (!draftOrganisation || !organisation) return;
    setSaving(true);
    const success = await useAdmin.updateOrganisation(
      organisation.organisationId,
      {
        name: draftOrganisation.name,
        coreHoursStart: timeToEpochISOString(
          formatTime(draftOrganisation.coreHoursStart)
        ),
        coreHoursEnd: timeToEpochISOString(
          formatTime(draftOrganisation.coreHoursEnd)
        ),
        workArrangements: draftOrganisation.workArrangements,
        workTimeControlPolicy: draftOrganisation.workTimeControlPolicy,
        minimumOfficeDays: draftOrganisation.minimumOfficeDays,
      }
    );
    if (success) {
      setOrganisation(draftOrganisation);
      setEditing(null);
    } else {
      console.error("Failed to save changes");
    }
    setSaving(false);
  };

  if (!organisation || !draftOrganisation) {
    return <div className={Styles.loading}>Loading…</div>;
  }

  return (
    <div className={Styles.dashboard}>
      <header className={Styles.header}>
        <h1 className={Styles.mainTitle}>{organisation.name}</h1>
        <p className={Styles.subTitle}>Manage your policies and work arrangements</p>
      </header>

      <section className={Styles.grid}>
        <div className={Styles.card}>
          <div className={Styles.cardHeader}>
            <h2>Policies</h2>
            {editing !== "policies" && (
              <button
                className={Styles.editButton}
                onClick={() => startEditing("policies")}
              >
                Edit
              </button>
            )}
          </div>

          <div className={Styles.kv}>
            <span>Core Hours</span>
            {editing === "policies" ? (
              <div className={Styles.timeInputs}>
                <input
                  type="time"
                  value={formatTime(draftOrganisation.coreHoursStart)}
                  onChange={(e) =>
                    setDraftOrganisation({
                      ...draftOrganisation,
                      coreHoursStart: e.target.value,
                    })
                  }
                />
                <span>–</span>
                <input
                  type="time"
                  value={formatTime(draftOrganisation.coreHoursEnd)}
                  onChange={(e) =>
                    setDraftOrganisation({
                      ...draftOrganisation,
                      coreHoursEnd: e.target.value,
                    })
                  }
                />
              </div>
            ) : (
              <span>
                {formatTime(organisation.coreHoursStart)} –{" "}
                {formatTime(organisation.coreHoursEnd)}
              </span>
            )}
          </div>

          <div className={Styles.kv}>
            <span>Work Time Control</span>
            {editing === "policies" ? (
              <select
                className={Styles.select}
                value={draftOrganisation.workTimeControlPolicy}
                onChange={(e) =>
                  setDraftOrganisation({
                    ...draftOrganisation,
                    workTimeControlPolicy: e.target.value as WorkTimeControlPolicy,
                  })
                }
              >
                <option value="Employee-Based">Employee-Based</option>
                <option value="Manager-Based">Manager-Based</option>
              </select>
            ) : (
              <span>{organisation.workTimeControlPolicy}</span>
            )}
          </div>

          <div className={Styles.kv}>
            <span>Working Arrangements</span>
            {editing === "policies" ? (
              <select
                className={Styles.select}
                value={draftOrganisation.workArrangements}
                onChange={(e) =>
                  setDraftOrganisation({
                    ...draftOrganisation,
                    workArrangements: e.target.value as WorkArrangement,
                  })
                }
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-Office">In-Office</option>
              </select>
            ) : (
              <span>{organisation.workArrangements}</span>
            )}
          </div>

          <div className={Styles.kv}>
            <span>Minimum Office Days</span>
            {editing === "policies" ? (
              <input
                type="number"
                min={0}
                max={5}
                className={Styles.input}
                value={draftOrganisation.minimumOfficeDays}
                onChange={(e) =>
                  setDraftOrganisation({
                    ...draftOrganisation,
                    minimumOfficeDays: Number(e.target.value),
                  })
                }
              />
            ) : (
              <span>{organisation.minimumOfficeDays}</span>
            )}
          </div>

          {editing === "policies" && (
            <div className={Styles.actions}>
              <button
                className={Styles.primaryButton}
                onClick={saveEditing}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                className={Styles.secondaryButton}
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={Styles.features}>
        <h2>Admin Capabilities</h2>
        <ul>
          <li>Create and manage organisations</li>
          <li>Define locations and office capacity</li>
          <li>Manage departments and teams</li>
          <li>Assign employees and managers</li>
          <li>Configure work arrangements and schedules</li>
        </ul>
      </section>
    </div>
  );
}
