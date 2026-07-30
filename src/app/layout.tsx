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
                const configuredAddinName = "testing_dashboard-geotab-dashboard-kappa_vercel_app";
                const hashAddinName = window.location.hash.startsWith("#addin-")
                  ? window.location.hash.slice(7)
                  : null;
                const addinNames = [configuredAddinName, hashAddinName].filter(Boolean);
                window.geotab = window.geotab || {};
                window.geotab.addin = window.geotab.addin || {};

                const isInIframe = window.self !== window.top;
                console.debug("AddinBootstrap: iframe check", {
                  isInIframe,
                  referrer: document.referrer,
                  location: window.location.href
                });

                addinNames.forEach((name) => {
                  if (!window.geotab.addin[name]) {
                    window.geotab.addin[name] = {
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
                    console.debug("AddinBootstrap: registered", name);
                  } else {
                    console.debug("AddinBootstrap: already registered", name);
                  }
                });
                console.debug("AddinBootstrap: registered names", addinNames);
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
