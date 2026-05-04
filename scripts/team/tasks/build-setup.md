# Task: Build Setup — Jaribooti App

**Project:** jaribooti
**Agent:** devops
**Priority:** medium

## Context

Read first:
- `/var/www/jaribooti-app/AGENTS.md`
- `/var/www/jaribooti-app/package.json`
- `/var/www/jaribooti-app/app.json`

## What to implement

### 1. Create .env.example

```bash
EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN=jaribooti.myshopify.com
EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

### 2. Update app.json

Verify/update these fields in `app.json.expo`:
- `android.package` = `com.jaribooti.app`
- `ios.bundleIdentifier` = `com.jaribooti.app`
- `scheme` = `jaribooti` (for deep linking)

### 3. Create app.config.ts

```typescript
import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: 'jaribooti-app',
    },
  },
})
```

### 4. Create eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 5. Create docs/BUILD.md

A short guide:
- Prerequisites: Node 18+, npm, Java 17+ (for Android)
- Copy `.env.example` to `.env` and fill in Shopify tokens
- `npm install`
- `npx expo prebuild --platform android` (generates android/ directory)
- `npx expo run:android` (for dev)
- For EAS Build: `eas build --platform android --profile production`

### 6. Update root _layout.tsx to wrap with ThemeProvider

The current `app/_layout.tsx` does NOT include `ThemeProvider`. Add it:

```typescript
import { ThemeProvider } from '@/context/ThemeContext'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
```

## Rules
- Only create files that don't exist yet
- Don't overwrite existing working files
- Keep package versions consistent with existing package.json

## Commit
Branch: `agent/jaribooti-build-setup`
Commit message: `chore: add build setup, EAS config, and env example`
Push and open PR to `master`.
