import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import type { IAccessTokenPayload, IAccessTokenRes } from '../Types/token'
import { usePost } from './useMyFetch'
import { ACCESS_TOKEN_URL, CLIENT_ID, CLIENT_SECRET } from '~/config'

export async function getAccesToken<T = IAccessTokenRes>(code: string): Promise<UseFetchReturn<T>> {
  const payload: IAccessTokenPayload = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
  }
  const config: UseFetchOptions = {
    beforeFetch({ options }) {
      options.headers = {
        Accept: 'application/json',
      }
      return {
        options,
      }
    },
  }
  return usePost<T>(ACCESS_TOKEN_URL, payload, config)
}

