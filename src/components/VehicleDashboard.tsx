"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchDevices, GeotabDevice } from "@/lib/geotab-api";

type DeviceStatusFilter = "all" | "active" | "inactive";

interface DashboardState {
  devices: GeotabDevice[];
  loading: boolean;
  error: string | null;
  search: string;
  statusFilter: DeviceStatusFilter;
}

const initialState: DashboardState = {
  devices: [],
  loading: true,
  error: null,
  search: "",
  statusFilter: "all"
};

const statusLabels: Record<DeviceStatusFilter, string> = {
  all: "All vehicles",
  active: "Active",
  inactive: "Inactive"
};

function getStatus(device: GeotabDevice) {
  if (device.activeTo && new Date(device.activeTo) < new Date()) {
    return "inactive";
  }
  return "active";
}

function classNames(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function VehicleDashboard() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function loadDevices() {
      if (typeof window === "undefined") return;
      const geotab = (window as any).geotab;
      if (!geotab || !geotab.api?.call) {
        setState((current) => ({
          ...current,
          loading: false,
          error: "MyGeotab Add-In API not available."
        }));
        return;
      }

      try {
        const devices = await fetchDevices();
        if (!mounted) return;

        setState((current) => ({
          ...current,
          devices,
          loading: false,
          error: null
        }));
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : String(error)
        }));
      }
    }

    loadDevices();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredDevices = useMemo(() => {
    const search = state.search.trim().toLowerCase();

    return state.devices.filter((device) => {
      if (state.statusFilter !== "all" && getStatus(device) !== state.statusFilter) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [device.name, device.serialNumber, device.deviceType, device.comment]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search));
    });
  }, [state.devices, state.search, state.statusFilter]);

  const summary = useMemo(() => {
    const active = state.devices.filter((device) => getStatus(device) === "active").length;
    const inactive = state.devices.length - active;
    return { total: state.devices.length, active, inactive };
  }, [state.devices]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.overline}>Vehicle fleet dashboard</p>
          <h1 style={styles.title}>MyGeotab vehicle list</h1>
          <p style={styles.description}>
            View vehicles from your MyGeotab account with instant filtering and
            communication status insights.
          </p>
        </div>
      </header>

      <section style={styles.cards}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total vehicles</p>
          <p style={styles.cardValue}>{summary.total}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Active</p>
          <p style={styles.cardValue}>{summary.active}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Inactive</p>
          <p style={styles.cardValue}>{summary.inactive}</p>
        </div>
      </section>

      <section style={styles.controls}>
        <input
          aria-label="Search vehicles"
          placeholder="Search by name, serial, type, or comment"
          value={state.search}
          onChange={(event) =>
            setState((current) => ({ ...current, search: event.target.value }))
          }
          style={styles.searchInput}
        />

        <div style={styles.filterGroup}>
          {Object.entries(statusLabels).map(([key, label]) => {
            const buttonStyle =
              key === state.statusFilter ? styles.filterActive : styles.filterButton;

            return (
              <button
                key={key}
                onClick={() =>
                  setState((current) => ({
                    ...current,
                    statusFilter: key as DeviceStatusFilter
                  }))
                }
                style={buttonStyle}
                aria-pressed={key === state.statusFilter}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.tableContainer}>
        {state.loading ? (
          <p>Loading vehicles…</p>
        ) : state.error ? (
          <div style={styles.errorBox}>
            <strong>Error</strong>: {state.error}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Serial</th>
                <th>Status</th>
                <th>Groups</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
                const status = getStatus(device);
                return (
                  <tr key={device.id}>
                    <td>{device.name}</td>
                    <td>{device.deviceType || "Unknown"}</td>
                    <td>{device.serialNumber || "—"}</td>
                    <td>
                      <span
                        style={
                          status === "active"
                            ? { ...styles.statusPill, ...styles.statusActive }
                            : { ...styles.statusPill, ...styles.statusInactive }
                        }
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      {device.groups?.length
                        ? device.groups.map((group) => group.name || group.id).join(", ")
                        : "None"}
                    </td>
                  </tr>
                );
              })}
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={5} style={styles.emptyRow}>
                    No vehicles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "24px",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#111827",
    minHeight: "100vh",
    backgroundColor: "#f5f7fb"
  },
  header: {
    marginBottom: "24px"
  },
  overline: {
    margin: 0,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "#6b7280"
  },
  title: {
    margin: "8px 0 8px",
    fontSize: "2rem",
    lineHeight: 1.1,
    color: "#0f172a"
  },
  description: {
    margin: 0,
    maxWidth: "720px",
    color: "#475569",
    fontSize: "1rem"
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  },
  card: {
    padding: "20px",
    borderRadius: "18px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    border: "1px solid rgba(148, 163, 184, 0.16)"
  },
  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.88rem"
  },
  cardValue: {
    margin: "12px 0 0",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#0f172a"
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  searchInput: {
    flex: 1,
    minWidth: "240px",
    maxWidth: "560px",
    padding: "12px 16px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "0.98rem",
    outline: "none"
  },
  filterGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  filterButton: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    cursor: "pointer",
    transition: "background-color 120ms ease, color 120ms ease"
  },
  filterActive: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #0ea5e9",
    background: "#eff6ff",
    color: "#0369a1",
    cursor: "pointer"
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px"
  },
  statusPill: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    textTransform: "capitalize",
    fontWeight: 600,
    fontSize: "0.9rem"
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#166534"
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b"
  },
  errorBox: {
    padding: "18px",
    borderRadius: "18px",
    border: "1px solid #fca5a5",
    background: "#fff1f2",
    color: "#991b1b"
  },
  emptyRow: {
    padding: "30px 0",
    textAlign: "center",
    color: "#64748b"
  }
};
