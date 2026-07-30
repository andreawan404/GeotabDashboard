import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyGeotab Vehicle Dashboard",
  description: "A scalable MyGeotab Add-In dashboard for vehicle lists."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <base href="https://geotab-dashboard-kappa.vercel.app/" />
        <Script
          id="geotab-addin-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const addinName = "geotabVehicleDashboard";
                window.geotab = window.geotab || {};
                window.geotab.addin = window.geotab.addin || {};

                const isInIframe = window.self !== window.top;
                console.debug("AddinBootstrap: iframe check", {
                  isInIframe,
                  referrer: document.referrer,
                  location: window.location.href
                });

                if (!window.geotab.addin[addinName]) {
                  window.geotab.addin[addinName] = {
                    initialize(api, state) {
                      window.geotab.api = api;
                      window.dispatchEvent(new Event("geotab-initialize"));
                      console.debug("AddinBootstrap: initialize called", { api, state });
                    },
                    focus() {
                      console.debug("AddinBootstrap: focus");
                    },
                    blur() {
                      console.debug("AddinBootstrap: blur");
                    }
                  };
                  console.debug("AddinBootstrap: registered", addinName);
                } else {
                  console.debug("AddinBootstrap: already registered", addinName);
                }

                if (window.geotab.api) {
                  console.debug("AddinBootstrap: geotab.api already present, dispatching event");
                  window.dispatchEvent(new Event("geotab-initialize"));
                }
              })();
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
