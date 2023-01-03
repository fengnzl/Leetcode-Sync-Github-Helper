import { createFetch } from '@vueuse/core'
import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import { LEETCODE_SYNC_TOKEN, LEETCODE_SYNC_TOKEN_TYPE, REQUEST_BASE_URL } from '../config/common'
import { storageLocal } from './useStorageLocal'

const useMyFetch = createFetch({
  baseUrl: REQUEST_BASE_URL,
  combination: 'overwrite',
  options: {
    async beforeFetch({ options }) {
      const [tokenType, token] = await Promise.all([
        storageLocal.getItem(LEETCODE_SYNC_TOKEN_TYPE),
        storageLocal.getItem(LEETCODE_SYNC_TOKEN),
      ])

      options.headers = {
        ...options.headers,
        Authorization: `${tokenType} ${token}`,
        Accept: 'application/json; application/vnd.github+json',
      }

      return { options }
    },
  },
})

export function useGet<T = unknown>(
  url: string,
  params = {},
  config: UseFetchOptions = {},
): UseFetchReturn<T> {
  url = Object.keys(params).reduce((prev, key) => {
    const param = `${key}=${params[key as keyof typeof params]}`
    return prev.includes('?') ? `${prev}&${param}` : `${prev}?${param}`
  }, url)
  return useMyFetch(url, config).get().json()
}

export function usePost<T = unknown, U = unknown>(
  url: string,
  payload?: U,
  config: UseFetchOptions = {},
): UseFetchReturn<T> {
  return useMyFetch<T>(url, config).post(payload).json()
}
