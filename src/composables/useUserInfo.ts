import type { IAccessTokenRes } from '../Types/token'
import type { IUserRes } from '../Types/user'
import { useGet } from './useMyFetch'

export function useUserInfo<T = IUserRes>(data: IAccessTokenRes) {
  return useGet<T>(
    '/user',
    {},
    {
      beforeFetch({ options }) {
        options.headers = {
          ...options.headers,
          Authorization: `${data.token_type} ${data.access_token}`,
          Accept: 'application/json',
        }

        return { options }
      },
    },
  )
}
