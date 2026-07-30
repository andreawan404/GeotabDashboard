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

async function waitForApi(timeout = 30000): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Geotab API is only available in the browser.");
  }

  if ((window as any).geotab?.api) return;

  // Wait either for the initialize event or for the api object to appear via polling
  return new Promise<void>((resolve, reject) => {
    let resolved = false;

    const onInit = () => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener("geotab-initialize", onInit);
      clearInterval(poll);
      clearTimeout(timer);
      resolve();
    };

    window.addEventListener("geotab-initialize", onInit);

    const poll = setInterval(() => {
      if ((window as any).geotab?.api) {
        if (resolved) return;
        resolved = true;
        window.removeEventListener("geotab-initialize", onInit);
        clearInterval(poll);
        clearTimeout(timer);
        resolve();
      }
    }, 500);

    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener("geotab-initialize", onInit);
      clearInterval(poll);
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
