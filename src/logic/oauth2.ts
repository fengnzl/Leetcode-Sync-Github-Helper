import { tabs } from 'webextension-polyfill'
import type { Tabs } from 'webextension-polyfill'
import { generateToken } from './storage'
import {
  AUTHORIZATION_URL,
  CLIENT_ID,
  REDIRECT_URL,
  SCOPES,
} from '~/config'

export function getAuthToken() {
  const url = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri${REDIRECT_URL}&scope=${SCOPES.join('%20')}`
  // create a tab to get auth
  const tabOptions: Tabs.CreateCreatePropertiesType = {
    url,
    active: true,
  }
  generateToken.value = true
  tabs.create(tabOptions)
}

