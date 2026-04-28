# PropSure - India's Property Companion

PropSure is a comprehensive mobile application designed to simplify the complex world of Indian real estate for the average citizen. Built with React Native and Expo, the app provides essential tools and quick access to state-wise portals for property verification, land records, and legal documentation.

## Features

- **State-Wise Land Records (Bhulekh)**: Quickly access land records, survey numbers, and khasra details for any state in India.
- **RERA Verification**: Access Real Estate Regulatory Authority (RERA) portals to verify builders, projects, and agents before making investments.
- **Instant Offline Rental Agreements**: Generate standard 11-month rental agreements instantly without an internet connection. The generated agreements are highly customizable and can be exported directly to PDF.
- **Stamp Duty Calculator**: Estimate registration costs and stamp duty percentages based on state regulations.
- **Mutation Guide**: Step-by-step guides for property name transfer (mutation) across different municipal corporations.
- **In-App Usage Tracking via WebView**: Government portals are opened directly inside the app using a custom WebView. This allows for seamless browsing, keeping the user engaged without throwing them into external web browsers, while enabling usage tracking to offer personalized feature recommendations.

## Technical Architecture

- **Framework**: React Native with Expo (SDK 54)
- **Routing**: Expo Router (File-based routing)
- **Styling**: Custom Theme System (No external UI libraries)
- **Offline First**: All heavy logic, including PDF generation and document rendering, is done strictly on-device without external APIs.
- **WebView Integration**: Uses `react-native-webview` for secure, trackable in-app browsing of external portals.

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your iOS/Android device

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DhruvNITDelhi/Propsure.git
   cd Propsure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code shown in the terminal with your Expo Go app to view the application on your device.

## Building for Production

To generate an Android APK or AAB for the Google Play Store, we use Expo Application Services (EAS).

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Build the application:
   ```bash
   # For Google Play Store (.aab)
   eas build -p android --profile production
   
   # For direct device installation (.apk)
   eas build -p android --profile preview
   ```

## Privacy & Security

PropSure values user privacy. 
- **No Data Collection**: We do not collect, store, or transmit any sensitive user data (Aadhaar numbers, names, property details) to external servers.
- **XSS Protection**: User inputs for PDF generation are strictly sanitized.
- **Local Execution**: The application is designed to function entirely offline wherever possible.

## License

This project is proprietary. All rights reserved.
