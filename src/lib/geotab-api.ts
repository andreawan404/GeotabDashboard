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

async function waitForApi(timeout = 7000): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Geotab API is only available in the browser.");
  }

  if ((window as any).geotab?.api) return;

  return new Promise<void>((resolve, reject) => {
    const onInit = () => {
      window.removeEventListener("geotab-initialize", onInit);
      resolve();
    };

    window.addEventListener("geotab-initialize", onInit);

    const t = setTimeout(() => {
      window.removeEventListener("geotab-initialize", onInit);
      clearTimeout(t);
      reject(new Error("MyGeotab API client not available (timeout)"));
    }, timeout);
  });
}

export async function fetchDevices(): Promise<GeotabDevice[]> {
  await waitForApi(7000);

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
