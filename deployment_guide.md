# PropSure — Deployment & Play Store Guide

This guide describes how to generate a mobile app file (APK) and prepare it for the Google Play Store.

---

## 🏗️ Phase 1: Building the APK (For Testing)

To get a file you can install directly on your Android phone, follow these steps:

### 1. Install EAS CLI
Run this command in your terminal (PowerShell or Command Prompt):
```bash
npm install -g eas-cli
```

### 2. Login to Expo
You need a free account at [expo.dev](https://expo.dev). Once registered, log in:
```bash
eas login
```

### 3. Start the Build
Run the following command to generate the **APK**:
```bash
npx eas build -p android --profile preview
```
- **What happens next?** EAS will ask if you want to generate a keystore (say **Yes**). It will then upload your code to the cloud and build the file for you.
- **Where is the file?** When the build finishes, it will provide a **link** to download the APK.

---

## 🚀 Phase 2: Publishing to Google Play Store

### 1. Requirements
- **Google Play Console Account:** A one-time $25 fee is required. Sign up at [play.google.com/console](https://play.google.com/console).
- **Production Build (AAB):** Google Play requires an `.aab` file (not `.apk`). Generate it with:
  ```bash
  npx eas build -p android --profile production
  ```

### 2. Mandatory App Configuration (`app.json`)
Ensure these values are finalized before your production build:
- **`package`**: `com.propsure.india` (Already set).
- **`version`**: `1.0.0` (Must be incremented for each update).
- **`versionCode`**: `1` (Must be an integer that increases with each release).

### 3. Play Store Assets
You will need:
- **App Icon:** 512x512px PNG.
- **Feature Graphic:** 1024x500px PNG.
- **Screenshots:** At least 2 for phone, 7-inch tablet, and 10-inch tablet.
- **Privacy Policy:** You must host a simple privacy policy on a website (e.g., GitHub Pages).

### 4. Submission Steps
1. Log in to your **Google Play Console**.
2. Click **Create App** and fill in the details.
3. Go to **Production** > **Create New Release**.
4. Upload the `.aab` file provided by the `production` build command.
5. complete the **App Content** section (Content Rating, Privacy Policy, Target Audience).
6. Submit for review.

---

## 📑 Build Profiles Summary

| Profile | Output | Use Case | Command |
|---------|--------|----------|---------|
| `preview` | `.apk` | Install on your phone for testing | `npx eas build -p android --profile preview` |
| `production` | `.aab` | Upload to Google Play Store | `npx eas build -p android --profile production` |

> [!TIP]
> Keep your `keystore` (generated automatically by EAS) safe by logging into your Expo dashboard. It is required to update your app in the future.
