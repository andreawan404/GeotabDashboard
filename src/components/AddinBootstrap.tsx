"use client";

import { useEffect } from "react";

export default function AddinBootstrap() {
  useEffect(() => {
    const addinName = "geotabVehicleDashboard";

    (window as any).geotab = (window as any).geotab || {};
    (window as any).geotab.addin = (window as any).geotab.addin || {};

    (window as any).geotab.addin[addinName] = {
      initialize(api: any, state: any) {
        (window as any).geotab.api = api;
        window.dispatchEvent(new Event("geotab-initialize"));
      },
      focus() {},
      blur() {}
    };

    return () => {
      try {
        delete (window as any).geotab.addin[addinName];
      } catch (_) {}
    };
  }, []);

  return null;
}
