import { onMessage } from 'webext-bridge'
import { notifications, runtime, tabs } from 'webextension-polyfill'
import { TOKEN_MESSAGE_ID } from '../config/oauth2'
import { removeActiveCurrentTab } from '../logic/tabs'
import IconPng from '../assets/icon.png'
import type { ITokenMessage } from '../Typings/token'
import { generateToken, leetcodeSyncToken, leetcodeSyncTokenType } from '../logic/storage'
import { gihubUserNameStorage } from '~/logic/storage'

onMessage(TOKEN_MESSAGE_ID, async ({ data }) => {
  const { isSuccess, isCloseCurrentTab } = data
  if (!isSuccess)
    handleTokenError(isCloseCurrentTab)
  else
    handleTokenSuccess(data)
})

function handleTokenError(isCloseCurrentTab: boolean) {
  notifications.create({
    type: 'basic',
    title: 'error',
    message: 'Something went wrong while trying to authenticate your GitHub!',
    iconUrl: IconPng,
  })
  if (isCloseCurrentTab) {
    notifications.onClicked.addListener(removeActiveCurrentTab)
    notifications.onClosed.addListener(removeActiveCurrentTab)
  }
}

function handleTokenSuccess(data: ITokenMessage) {
  const { username, tokenType, token } = data
  // set token info in storage
  generateToken.value = false
  leetcodeSyncToken.value = token
  gihubUserNameStorage.value = username
  leetcodeSyncTokenType.value = tokenType
  // close current active tab - github
  removeActiveCurrentTab()
  // to options page set github repo
  const optionsPage = runtime.getURL('dist/options/index.html')
  tabs.create({ url: optionsPage, active: true })
}

