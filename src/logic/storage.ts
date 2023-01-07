import {
  GITHUB_REPO_NAME,
  GITHUB_USER_NAME,
  IS_GENERATE_TOKEN,
  LEETCODE_PROBLEM_SHA,
  LEETCODE_PROBLEM_SOLVED,
  LEETCODE_SYNC_TOKEN,
  LEETCODE_SYNC_TOKEN_TYPE,
} from '../config/common'
import { useStorageLocal } from '~/composables/useStorageLocal'
import type { IProblemShaValue, IProblemSolved } from '~/Types/leetcode'

export const leetcodeSyncToken = useStorageLocal<string>(LEETCODE_SYNC_TOKEN, '', { listenToStorageChanges: true })

export const generateToken = useStorageLocal<boolean>(IS_GENERATE_TOKEN, false, {
  listenToStorageChanges: true,
})

export const gihubUserNameStorage = useStorageLocal<string>(GITHUB_USER_NAME, '', { listenToStorageChanges: true })

export const leetcodeSyncTokenType = useStorageLocal<string>(LEETCODE_SYNC_TOKEN_TYPE, '', { listenToStorageChanges: true })

export const githubRepoNameStorage = useStorageLocal<string>(GITHUB_REPO_NAME, '')

export const leetcodeProblemSolved = useStorageLocal<IProblemSolved>(
  LEETCODE_PROBLEM_SOLVED,
  {
    easy: 0,
    medium: 0,
    hard: 0,
  },
)

export const leetcodeProblemSha = useStorageLocal<Record<string, IProblemShaValue>>(
  LEETCODE_PROBLEM_SHA,
  {},
)
