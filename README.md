# Ivybee mobile app

Ivybee is Ivy Brilliance's private school-to-family app for Android, iOS and web. The first release is intentionally focused on the parent experience.

## Current scope

- branded animated splash screen;
- parent/guardian email and password sign-in;
- securely stored session on the device;
- school-linked children;
- child class groups;
- teacher and school updates with photos;
- private payment history and receipt email actions;
- native push-notification registration for Android and iOS;
- a one-tap sample parent preview for demonstrations.

## Run locally

```powershell
npm install
npx expo start
```

Press `w` for the web preview, scan the QR code with Expo Go, or choose an available device simulator. On the welcome screen, choose **Preview the parent app**. No API connection is required for the demo parent.

Live email/password sign-in uses the Creche API. Configure it before starting Expo:

```powershell
$env:EXPO_PUBLIC_CRECHE_API_URL='http://localhost:5080/api/v1'
```

On a physical phone, replace `localhost` with the development computer's local network address. The **Preview the parent app** option uses clearly labelled sample data and does not call the API.

The app does not contain production child data, social provider secrets or real media. School administrators remain responsible for linking approved guardians to children.

## Checks

```powershell
npx tsc --noEmit
npx eslint app constants services store --ext .ts,.tsx
```
