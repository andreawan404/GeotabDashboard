export interface GeotabDevice {
  id: string;
  name: string;
  serialNumber?: string;
  deviceType?: string;
  comment?: string;
  activeFrom?: string;
  activeTo?: string;
  groups?: Array<{ id: string; name?: string }>;
}

export async function fetchDevices(): Promise<GeotabDevice[]> {
  if (typeof window === "undefined") {
    throw new Error("Geotab API is only available in the browser.");
  }

  const geotab = (window as any).geotab;
  if (!geotab || !geotab.api?.call) {
    throw new Error("MyGeotab API client not available.");
  }

  const response = await geotab.api.call("Get", {
    typeName: "Device",
    resultsLimit: 500
  });

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map((device: any) => ({
    id: device.id,
    name: device.name || "(no name)",
    serialNumber: device.serialNumber,
    deviceType: device.deviceType?.name || device.deviceType,
    comment: device.comment,
    activeFrom: device.activeFrom,
    activeTo: device.activeTo,
    groups: device.groups || []
  }));
}
