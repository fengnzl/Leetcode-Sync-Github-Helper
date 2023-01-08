import { githubOwnerRepo } from './../logic/leetcode'
import { useGet, usePatch } from './useMyFetch'
import type { IReferenceRes, IReferenceUpdate } from '~/Types/github'
import { ENDNOTE, GITHUB_BRAMCH } from '~/config'
// https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference

export const useGithubReference = () => {
  const mainRefSha = ref('')
  const isUploadSuccess = ref<boolean>(false)
  async function getBranchRef(branch = GITHUB_BRAMCH) {
    const { data, statusCode, error } = await useGet<IReferenceRes>(
      `/repos/${githubOwnerRepo}/git/ref/heads/${branch}`,
    )
    if (statusCode.value === 200 && !error.value)
      mainRefSha.value = data.value?.object.sha || ''
    else
      console.warn(`Error when getting ${branch} reference - ${ENDNOTE}`)
    return mainRefSha.value
  }
  async function updateBranchRef(params: {
    sha: string
    branch?: string
  }) {
    const { statusCode, error } = await usePatch<
      IReferenceRes,
      IReferenceUpdate
    >(
      `/repos/${githubOwnerRepo}/git/refs/heads${
        params.branch || GITHUB_BRAMCH
      }`,
      {
        sha: params.sha,
      },
    )
    if (statusCode.value === 200 && !error.value) { isUploadSuccess.value = true }
    else {
      console.warn(
        `Error when update ${
          params.branch || GITHUB_BRAMCH
        } reference - ${ENDNOTE}`,
      )
    }
  }
  return {
    mainRefSha,
    getBranchRef,
    updateBranchRef,
    isUploadSuccess,
  }
}
