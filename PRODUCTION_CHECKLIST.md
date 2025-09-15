# Production Build Checklist for Meal Mate

This checklist helps ensure that your Expo/React Native app works correctly when built as a standalone APK or when deployed to EAS.

## Before Building

- [ ] Run `expo doctor` to check for any configuration issues
- [ ] Ensure all required permissions are listed in `app.json` (Android and iOS)
- [ ] Verify that `newArchEnabled=true` is set in both `app.json` and `gradle.properties`
- [ ] Make sure all native dependencies are properly linked
- [ ] Run the app in Expo development mode to check for any warnings
- [ ] Test user authentication flow in development mode
- [ ] Test meal creation and management in development mode
- [ ] Test notification scheduling in development mode

## Configuration Files Check

- [ ] `app.json`: Verify correct app name, bundle ID, and version
- [ ] `eas.json`: Ensure proper build profiles are set up including Java 17 support
- [ ] `android/settings.gradle`: Check for proper path resolution
- [ ] `android/gradle.properties`: Verify correct settings including `newArchEnabled=true`
- [ ] `firebase.ts`: Ensure Firebase configuration is correct for production

## Permission Handling

- [ ] Add initialization code for requesting permissions at app startup
- [ ] Handle permission denials gracefully
- [ ] Test notification permissions
- [ ] Test camera permissions
- [ ] Test storage/media library permissions

## AsyncStorage and Native Modules

- [ ] Initialize AsyncStorage at app startup and test for functionality
- [ ] Ensure all native modules are properly initialized
- [ ] Add error handling for all native module calls
- [ ] Test each native feature (camera, notifications, storage) in isolation

## Network Requests and Image Handling

- [ ] Add proper error handling for all network requests
- [ ] Add timeouts for fetch operations
- [ ] Implement fallbacks for failed image uploads
- [ ] Test app behavior when offline
- [ ] Validate responses from external APIs

## Build and Testing

- [ ] Use `eas build --platform android --profile android-java17` to build
- [ ] Install APK on multiple Android versions to test compatibility
- [ ] Test each major feature in the production build
- [ ] Verify authentication works in production
- [ ] Verify notifications work in production
- [ ] Verify camera and image upload work in production
- [ ] Verify meal scheduling works in production

## Production-Specific Issues to Watch For

1. **Permissions**: Native permissions might need to be requested explicitly in production builds
2. **AsyncStorage**: Ensure it's initialized and working correctly before using it
3. **Network Requests**: Add comprehensive error handling and timeouts
4. **Native Modules**: Test each one independently
5. **Navigation**: Test deep linking and screen transitions
6. **Firebase**: Verify authentication works in production mode
7. **Image Upload**: Validate responses and handle failures gracefully
8. **Java Version**: Make sure to use Java 17 for builds with the New Architecture
