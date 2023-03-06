import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

// https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/
interface IRuleResourceType {
  id: string
  enabled: boolean
  path: string
}
interface WebExtensionManifest extends Manifest.WebExtensionManifest {
  declarative_net_request?: {
    rule_resources: IRuleResourceType[]
  }
}
export async function getManifest() {
  const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: WebExtensionManifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    homepage_url: pkg.homepage,
    action: {
      default_icon: './assets/icon.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: './dist/background/index.mjs',
    },
    icons: {
      16: './assets/icon.png',
      48: './assets/icon.png',
      128: './assets/icon.png',
    },
    permissions: ['tabs', 'storage', 'activeTab', 'notifications'],
    host_permissions: ['*://*/*'],
    content_scripts: [
      {
        matches: [
          'https://leetcode.com/problems/*',
          'https://leetcode.cn/problems/*',
        ],
        js: ['./dist/contentScripts/index.global.js'],
        run_at: 'document_idle',
      },
      {
        matches: ['https://github.com/*'],
        js: ['./dist/contentScripts/authorize.mjs'],
        run_at: 'document_idle',
      },
    ],
    web_accessible_resources: [
      {
        resources: ['dist/contentScripts/style.css'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      // this is required on dev for Vite script to load
      extension_pages: isDev
        ? `script-src 'self' http://localhost:${port}; object-src 'self' http://localhost:${port}`
        : 'script-src \'self\'; object-src \'self\'',
    },
  }

  if (isDev)
    manifest.permissions?.push('webNavigation')

  return manifest
}
