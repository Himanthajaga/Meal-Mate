# Fixing Build Issues

If you're experiencing dependency conflicts when building with EAS, follow these steps to resolve them:

## 1. Clean up dependencies

Run the cleanup script:

```bash
npm run cleanup
```

This will:

- Remove package-lock.json
- Remove node_modules
- Create a proper .npmrc file

## 2. Reinstall dependencies with legacy-peer-deps

```bash
npm install --legacy-peer-deps
```

## 3. Build using the new build script

```bash
npm run build:android
```

## Manual build steps (if the above doesn't work)

1. Delete node_modules and package-lock.json

   ```bash
   npx rimraf node_modules package-lock.json
   ```

2. Make sure .npmrc has these settings:

   ```
   engine-strict=false
   legacy-peer-deps=true
   ```

3. Install with legacy peer deps:

   ```bash
   npm install --legacy-peer-deps
   ```

4. Run the build with:
   ```bash
   eas build --platform android --profile production
   ```

## Issues with Node.js version

The project requires Node.js version 20.19.4 or higher. If you're getting Node.js version errors:

1. Update your Node.js version to 20.19.4 or higher
2. Or use nvm to switch to the right version:
   ```bash
   nvm install 20.19.4
   nvm use 20.19.4
   ```

## Build server issues

If the EAS build server is having issues with Node.js versions:

1. Try adding this to package.json:

   ```json
   "overrides": {
     "metro": "0.80.5",
     "metro-resolver": "0.80.5"
   }
   ```

2. Or downgrade React Native to a version compatible with your Node.js version.

## Contact Support

If none of these solutions work, contact Expo support for further assistance.
