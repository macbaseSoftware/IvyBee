# Ivybee mobile app

Ivybee is the Ivy Brilliance learning experience for students and families. This repository contains the Expo / React Native application for Android, iOS and web.

## Demo

The current demonstration includes:

- one-tap student and parent previews;
- a role-aware Today dashboard;
- learning progress and subject insights;
- a discovery library;
- an account and preferences screen;
- a black, gold and warm-neutral visual system with restrained learning colours.

## Run locally

```powershell
npm install
npx expo start
```

Press `w` for the web preview, scan the QR code with Expo Go, or choose an available device simulator. On the welcome screen, select **Student** or **Parent** under **Quick demo**. No API connection is required for either demo persona.

Live email/password sign-in continues to use `EXPO_PUBLIC_API_URL` from the local environment files.

## Checks

```powershell
npx tsc --noEmit
npx eslint app constants services store --ext .ts,.tsx
```
