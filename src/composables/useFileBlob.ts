import type { IFileBolb, IFileBolbRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { githubOwnerRepo } from '~/logic/leetcode'
import { ENDNOTE } from '~/config/common'

// https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28
export const useFileBlob = () => {
  const fileBolbSha = ref<string>('')
  async function getFileBlob(params: IFileBolb) {
    const { data, statusCode, error } = await usePost<IFileBolbRes, IFileBolb>(
      `/repos/${githubOwnerRepo}/git/blobs`,
      {
        content: params.content,
        encodeing: params.encodeing || 'utf-8',
      },
    )
    if (statusCode.value === 200 && !error.value)
      fileBolbSha.value = data.value?.sha || ''
    else
      console.warn(`Error when getting file bolb - ${ENDNOTE}`)
    return fileBolbSha.value
  }
  return {
    fileBolbSha,
    getFileBlob,
  }
}
