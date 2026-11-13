# SmartPark (Flutter) – Modern Parking & Live Monitoring

Flutter version of the SmartPark dashboard: live vehicle tracking, parking bay monitoring, movement logs, revenue and analytics, with an animated opening video. One codebase for Android, iOS and web.

> **Status:** this README describes the planned Flutter structure. The existing SmartPark project is a React web app; the Flutter code still needs to be created. Packages and folder names below are suggestions, so change them to fit your final code.

## Features

- Opening intro video with music (skippable)
- Dashboard: occupancy, free bays, entries/exits today
- Interactive parking map grouped by zone
- Auto Car Sense: simulated plate-recognition gates with automatic timestamps
- Live monitoring, vehicle management, movement history, plate search
- Reports, revenue and payments, notifications, staff, settings
- Light and dark themes, responsive layout (phone and tablet)

## Requirements

- Flutter SDK 3.x (run `flutter --version`)
- Android Studio (Android SDK) and/or Xcode for iOS
- A phone or emulator

Check your setup with `flutter doctor`.

## Getting Started

```bash
flutter create smartpark
cd smartpark
# copy the lib/, assets/ and pubspec.yaml from this project, then:
flutter pub get
flutter run
```

## Suggested Packages

Add with `flutter pub add <name>`:

| Package | Use |
| --- | --- |
| `video_player` | Opening intro video |
| `provider` or `flutter_riverpod` | State management |
| `fl_chart` | Analytics charts |
| `google_fonts` | Typography |
| `shared_preferences` | Save settings and theme locally |
| `intl` | Dates, durations, currency |

## Suggested Structure

```
lib/
  main.dart             App entry, theme, routes
  screens/              dashboard, spaces, auto_sense, movements,
                        revenue, staff, settings, intro_splash
  widgets/              bay_tile, plate_badge, stat_card, nav bars
  models/               vehicle, bay, movement
  services/             demo data now, real API later
assets/
  video/intro.mp4       Opening video
  images/               Logo and icons
```

## Opening Intro

1. Put `intro.mp4` in `assets/video/`.
2. Declare it in `pubspec.yaml`:
   ```yaml
   flutter:
     assets:
       - assets/video/intro.mp4
       - assets/images/
   ```
3. Play it full screen with `VideoPlayerController.asset('assets/video/intro.mp4')` on the first screen. Navigate to the dashboard when the video ends or when the user taps **Skip**. Add a fallback so the app opens even if the video fails to load.

## Build the APK

```bash
flutter build apk --release                 # one universal APK
flutter build apk --split-per-abi           # smaller APKs per CPU type
flutter build appbundle --release           # .aab for the Play Store
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

### App name, id and icon

- Name: `android/app/src/main/AndroidManifest.xml` (`android:label`)
- Package id: `applicationId` in `android/app/build.gradle`
- Icon: use the `flutter_launcher_icons` package with your logo

### Signing for the Play Store

1. Create a keystore: `keytool -genkey -v -keystore smartpark.jks -keyalg RSA -keysize 2048 -validity 10000 -alias smartpark`
2. Reference it in `android/key.properties` and `android/app/build.gradle`.
3. Keep the keystore and passwords safe and **never commit them to Git**. You need the same key for every update.

## Build for Other Platforms

```bash
flutter build web --release
flutter build ios --release     # requires macOS and Xcode
```

## Notes

- The app starts with demo data. To use real data, replace the code in `services/` with API calls.
- Never put secret API keys in the app code. Anything shipped in an APK can be extracted, so keep secrets on a server.
