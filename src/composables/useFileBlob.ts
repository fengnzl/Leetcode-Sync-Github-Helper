import type { IFileBolb, IFileBolbRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { ENDNOTE } from '~/config/common'
import { githubRepoNameStorage } from '~/logic/storage'

// https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28
export const useFileBlob = () => {
  const fileBolbSha = ref<string>('')
  async function getFileBlob(params: IFileBolb) {
    const { data, statusCode, error } = await usePost<IFileBolbRes, IFileBolb>(
      `/repos/${githubRepoNameStorage.value}/git/blobs`,
      {
        content: params.content,
        encodeing: params.encodeing || 'utf-8',
      },
    )
    if (statusCode.value === 201 && !error.value)
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
