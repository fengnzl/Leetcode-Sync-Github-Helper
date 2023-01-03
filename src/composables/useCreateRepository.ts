import type { ICreateRepos } from '../Typings/github'
import { usePost } from './useMyFetch'
// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
export async function useCreateRepository(repoInfo: ICreateRepos) {
  const { data, statusCode, isFetching, onFetchResponse } = await usePost(
    '/user/repos',
    {
      ...repoInfo,
      auto_init: true,
      description:
        'Collection of LeetCode questions to ace the coding interview! - Created using [Leecode Sync Github Helper](https://github.com/fengnzl/Leetcode-Sync-Github-Helper)',
    },
  )
  onFetchResponse((response) => {
    // eslint-disable-next-line no-console
    console.log(response.status)
  })
  return {
    data,
    isFetching,
    statusCode,
  }
}
