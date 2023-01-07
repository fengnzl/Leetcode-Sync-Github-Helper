import { createFetch } from '@vueuse/core'
import type { UseFetchReturn } from '@vueuse/core'
import jscookie from 'js-cookie'
import { getLeetcodeInfo } from '../config/leetcode'
import type { IPostConig } from '~/Types/leetcode'

const useMyFetch = createFetch({
  baseUrl: getLeetcodeInfo().BASE_URL,
  options: {
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        ...jscookie.get(),
      }

      return {
        options,
      }
    },
  },
})

export function useLeetcodePost<T = unknown, U = unknown>(config: IPostConig<U>): UseFetchReturn<T> {
  return useMyFetch<T>(config.url || '').post(config.payload).json()
}
