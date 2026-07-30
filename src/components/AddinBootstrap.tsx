"use client";

import { useEffect } from "react";

export default function AddinBootstrap() {
  useEffect(() => {
    const addinName = "geotabVehicleDashboard";

    console.debug("AddinBootstrap: mounting, registering addin handler");

    (window as any).geotab = (window as any).geotab || {};
    (window as any).geotab.addin = (window as any).geotab.addin || {};

    (window as any).geotab.addin[addinName] = {
      initialize(api: any, state: any) {
        console.debug("AddinBootstrap: initialize called", { api, state });
        (window as any).geotab.api = api;
        window.dispatchEvent(new Event("geotab-initialize"));
      },
      focus() {},
      blur() {}
    };

    // If portal already injected api earlier, dispatch immediately
    if ((window as any).geotab.api) {
      console.debug("AddinBootstrap: geotab.api already present, dispatching event");
      window.dispatchEvent(new Event("geotab-initialize"));
    }

    return () => {
      try {
        delete (window as any).geotab.addin[addinName];
      } catch (_) {}
    };
  }, []);

  return null;
}
