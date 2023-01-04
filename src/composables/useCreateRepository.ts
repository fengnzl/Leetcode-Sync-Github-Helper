import type {
  CreateReposStatusCode,
  ICreateRepos,
  IRepoInfoRes,
} from '../Types/github'
import { usePost } from './useMyFetch'
// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user
export async function useCreateRepository(repoInfo: ICreateRepos) {
  const { data, statusCode, isFetching } = await usePost<IRepoInfoRes>(
    '/user/repos',
    {
      ...repoInfo,
      auto_init: true,
      description:
        'Collection of LeetCode questions to ace the coding interview! - Created using [Leecode Sync Github Helper](https://github.com/fengnzl/Leetcode-Sync-Github-Helper)',
    },
  )
  return {
    data,
    isFetching,
    message: statusCode.value ? getErrorMsg(statusCode.value as CreateReposStatusCode, repoInfo.name) : '',
    isSuccess: statusCode.value === 201,
  }
}

function getErrorMsg(statusCode: CreateReposStatusCode, name: string): string {
  const msgPrefix = `Error creating ${name}`
  const msgObj = {
    304: `${msgPrefix} - Unable to modify repository. Please try again later!`,
    400: `${msgPrefix} - Bad Request. Please make sure that no script files are overwritten.`,
    401: `${msgPrefix} - Doesn't have authentication. Please authenticate first!`,
    403: `${msgPrefix} - Access forbidden. Please try again later!`,
    404: `${msgPrefix} - Resource not found. Please try again later!`,
    422: `${msgPrefix} - Validation failed. Repository may have already been created. Please attach it!`,
  }
  return msgObj[statusCode]
}
