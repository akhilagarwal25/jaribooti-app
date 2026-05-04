const fs = require('fs')
const os = require('os')
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

const fileMapCacheDirectory = path.join(
  os.tmpdir(),
  'jaribooti-app-metro-file-map',
  process.version,
)
try {
  fs.mkdirSync(fileMapCacheDirectory, { recursive: true })
  config.fileMapCacheDirectory = fileMapCacheDirectory
} catch {
  // Tmp not writable: omit custom path so Metro uses its default.
}

module.exports = withNativeWind(config, { input: path.resolve(__dirname, 'global.css') })
