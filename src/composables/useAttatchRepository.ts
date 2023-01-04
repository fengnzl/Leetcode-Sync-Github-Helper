import type { IRepoInfoRes, LinkReposStatusCode } from '../Types/github'
import { useGet } from './useMyFetch'
// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
export async function useAttatchRepository(name: string) {
  const { data, statusCode, isFetching } = await useGet<IRepoInfoRes>(`/repos/${name}`)
  return {
    data,
    isFetching,
    message: statusCode.value
      ? getErrorMsg(statusCode.value as LinkReposStatusCode, name)
      : '',
    isSuccess: statusCode.value === 200,
  }
}

function getErrorMsg(statusCode: LinkReposStatusCode, name: string): string {
  const msgPrefix = `Error attatching \b <a style="color: #0969da" target="blank" href="https://github.com/${name}">${name}</a>.`
  const msgObj = {
    301: `${msgPrefix} The repository has been moved permenantly. Try creating a new one!`,
    403: `${msgPrefix} Access forbidden. Please try again later!`,
    404: `${msgPrefix} Resource not found. Please make sure the repository name is correct!`,
  }
  return msgObj[statusCode]
}
