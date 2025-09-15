# Meal Mate Build Guide

## Common Build Issues & Solutions

When building the Android app, you might encounter dependency conflicts or Node.js version issues. This guide provides solutions to common problems.

## Quick Fix Scripts

We've included helper scripts to automate the build process:

### Windows:

```powershell
# Run the PowerShell script
.\scripts\build-android.ps1
```

### Mac/Linux:

```bash
# Make the script executable
chmod +x ./scripts/build-android.sh

# Run the script
./scripts/build-android.sh
```

## Manual Solutions

If the scripts don't work, follow these manual steps:

### 1. Fix for "Unsupported @types/react version" Error

The error occurs because React Native 0.81.4 requires `@types/react@^19.1.0`, but the project uses an incompatible version.

**Solution:**

1. Edit package.json
2. Change `"@types/react": "~19.0.10"` to `"@types/react": "^19.1.0"`
3. Run `npm install --legacy-peer-deps`

### 2. Fix for Node.js Version Issues

React Native 0.81.4 requires Node.js 20.19.4 or higher, but Expo's build servers might have a different version.

**Solutions:**

#### Option A: Use downgraded dependencies

We've included a compatible package.json with downgraded dependencies:

```bash
# Backup current package.json
cp package.json package.json.backup

# Use the downgraded version
cp package.json.downgraded package.json

# Install dependencies and build
npm install --legacy-peer-deps
eas build --platform android --profile production
```

#### Option B: Configure EAS to use the right Node version

Edit eas.json to specify the Node.js version:

```json
"production": {
  "node": "20.19.4",
  "env": {
    "NODE_OPTIONS": "--legacy-peer-deps"
  }
}
```

### 3. Fix for Metro Version Conflicts

If you're getting Metro-related errors, add overrides to package.json:

```json
"overrides": {
  "metro": "0.80.5",
  "metro-resolver": "0.80.5"
}
```

### 4. Fix for npm CI errors

Create a .npmrc file in your project root:

```
engine-strict=false
legacy-peer-deps=true
```

## Complete Cleanup & Rebuild Process

If all else fails, try this complete rebuild process:

```bash
# 1. Delete dependency files
rm -rf node_modules package-lock.json yarn.lock

# 2. Create .npmrc
echo "engine-strict=false" > .npmrc
echo "legacy-peer-deps=true" >> .npmrc

# 3. Use the downgraded package.json
cp package.json.downgraded package.json

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. Run the build
eas build --platform android --profile production --non-interactive
```

## For EAS Build Server Issues

If the EAS build server is having Node.js compatibility issues, you can:

1. Try a different EAS build server (if available)
2. Build locally using `expo build:android`
3. Contact Expo support for help

## Debugging Tips

- Check the build logs for specific dependency conflicts
- Try `--force` instead of `--legacy-peer-deps` if needed
- Use `npm ls @types/react` to check installed React types version
- Check Node.js version with `node -v`

## Alternative Build Methods

If EAS builds continue to fail, consider:

1. Using Expo Application Services (EAS) with a custom build profile
2. Building locally with `expo build:android`
3. Ejecting from Expo and building with native Android tools

---

For further assistance, contact the Meal Mate development team.
