import { IS_GENERATE_TOKEN, LEETCODE_SYNC_TOKEN } from '../config/common'
import { useStorageLocal } from '~/composables/useStorageLocal'

export const leetcodeSyncToken = useStorageLocal<string>(LEETCODE_SYNC_TOKEN, '', { listenToStorageChanges: true })

export const generateToken = useStorageLocal<boolean>(IS_GENERATE_TOKEN, false, {
  listenToStorageChanges: true,
})
