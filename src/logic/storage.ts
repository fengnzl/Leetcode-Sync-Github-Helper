import {
  GITHUB_REPO_NAME,
  GITHUB_USER_NAME,
  IS_GENERATE_TOKEN,
  LEETCODE_ALL_ONE_COMMIT,
  LEETCODE_PROBLEM_DIFFICULT,
  LEETCODE_PROBLEM_NOTES__SHA,
  LEETCODE_PROBLEM_SHA,
  LEETCODE_PROBLEM_SOLVED,
  LEETCODE_SYNC_TOKEN,
  LEETCODE_SYNC_TOKEN_TYPE,
} from '../config/common'
import { useStorageLocal } from '~/composables/useStorageLocal'
import type { IProblemBasicInfo, IProblemSolved } from '~/Types/leetcode'

export const leetcodeSyncToken = useStorageLocal<string>(LEETCODE_SYNC_TOKEN, '', { listenToStorageChanges: true })

export const generateToken = useStorageLocal<boolean>(IS_GENERATE_TOKEN, false, {
  listenToStorageChanges: true,
})

export const gihubUserNameStorage = useStorageLocal<string>(GITHUB_USER_NAME, '', { listenToStorageChanges: true })

export const leetcodeSyncTokenType = useStorageLocal<string>(LEETCODE_SYNC_TOKEN_TYPE, '', { listenToStorageChanges: true })

export const githubRepoNameStorage = useStorageLocal<string>(GITHUB_REPO_NAME, '', {
  listenToStorageChanges: true,
})

export const leetcodeProblemSolved = useStorageLocal<IProblemSolved>(
  LEETCODE_PROBLEM_SOLVED,
  {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  },
)

export const leetcodeProblemSha = useStorageLocal<Record<string, string>>(
  LEETCODE_PROBLEM_SHA,
  {},
)

export const leetcodeAllOneCommitStorage = useStorageLocal<boolean>(LEETCODE_ALL_ONE_COMMIT, true)

export const problemBasicInfoStorage = useStorageLocal<
  Record<string, IProblemBasicInfo>
  >(LEETCODE_PROBLEM_DIFFICULT, {})

export const problemNotesInfoStorage = useStorageLocal<
    Record<string, string>
  >(LEETCODE_PROBLEM_DIFFICULT, {})

export const leetcodeProblemNotesSha = useStorageLocal<Record<string, string>>(
  LEETCODE_PROBLEM_NOTES__SHA,
  {},
)
