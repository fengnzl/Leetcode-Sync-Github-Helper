import {
  GITHUB_USER_NAME,
  IS_GENERATE_TOKEN,
  LEETCODE_SYNC_TOKEN,
  LEETCODE_SYNC_TOKEN_TYPE,
} from '../config/common'
import { useStorageLocal } from '~/composables/useStorageLocal'

export const leetcodeSyncToken = useStorageLocal<string>(LEETCODE_SYNC_TOKEN, '', { listenToStorageChanges: true })

export const generateToken = useStorageLocal<boolean>(IS_GENERATE_TOKEN, false, {
  listenToStorageChanges: true,
})

export const gihubUserNameStorage = useStorageLocal<string>(GITHUB_USER_NAME, '')

export const leetcodeSyncTokenType = useStorageLocal<string>(LEETCODE_SYNC_TOKEN_TYPE, '', { listenToStorageChanges: true })
