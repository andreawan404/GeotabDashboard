# MyGeotab Vehicle Dashboard Add-In

This repository contains a production-ready starter for a MyGeotab custom page Add-In dashboard using React and Next.js.

## What it is

- A MyGeotab Add-In page for listing vehicles in a MyGeotab account.
- Uses the portal-provided `geotab.api.call` object for secure API access.
- Includes search, status filtering, summary cards, and a responsive vehicle table.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Start development
   ```bash
   npm run dev
   ```

3. Build for production
   ```bash
   npm run build
   npm run export
   ```

## Add-In deployment

1. Host the exported content or page HTML on a public HTTPS URL.
2. Add a MyGeotab Add-In configuration entry under Administration > System > System Settings > Add-Ins.
3. Provide an `items` entry with a `url` that points to the hosted `page.html` or page endpoint.

## MyGeotab Add-In notes

- The Add-In should use a unique `geotab.addin.<name>` namespace.
- The Add-In lifecycle uses `initialize`, `focus`, and `blur` to manage load and cleanup.
- The portal passes an authenticated API object; this code assumes `geotab.api.call` is available.

## Extending the dashboard

- Add `DeviceStatusInfo` or `GpsStatus` queries for richer vehicle health and location status.
- Add group-aware filtering by using `state.getGroupFilter()` if the portal provides page state.
- Add persistent user settings with MyGeotab AddInData storage if needed.
