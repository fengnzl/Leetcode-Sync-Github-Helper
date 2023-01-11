import type { IUploadSingleParam, IUploadSingleReq, IUploadSingleRes } from '../Types/github'
import { usePut } from './useMyFetch'
import { ENDNOTE } from '~/config/common'
import { githubRepoNameStorage } from '~/logic/storage'

// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
export const useUploadSingle = () => {
  const uploadSha = ref<string>('')
  const isUploadSuccess = ref(false)
  async function uploadSingle(params: IUploadSingleParam) {
    // not need sha just replace
    if (!params.sha)
      delete params.sha

    const { data, statusCode } = await usePut<
      IUploadSingleRes,
      IUploadSingleReq
    >(
      `/repos/${githubRepoNameStorage.value}/contents/${params.path}`,
      params,
    )
    if (statusCode.value === 201 || statusCode.value === 200) {
      isUploadSuccess.value = true
      uploadSha.value = data.value?.content.sha || ''
    }
    else {
      console.warn(`Error when creating commit - ${ENDNOTE}`)
    }
  }
  return {
    uploadSingle,
    uploadSha,
    isUploadSuccess,
  }
}
