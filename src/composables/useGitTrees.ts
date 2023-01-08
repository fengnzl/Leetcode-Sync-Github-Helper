import type { ITrees, ITreesRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { ENDNOTE } from '~/config/common'
import { githubRepoNameStorage } from '~/logic/storage'

// https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28
export const useGitTrees = () => {
  const treeSha = ref<string>('')
  async function getGitTrees(params: ITrees) {
    const { data, statusCode, error } = await usePost<ITreesRes, ITrees>(
      `/repos/${githubRepoNameStorage.value}/git/trees`,
      params,
    )
    if (statusCode.value === 201 && !error.value)
      treeSha.value = data.value?.sha || ''
    else
      console.warn(`Error when getting trees sha - ${ENDNOTE}`)
  }
  return {
    getGitTrees,
    treeSha,
  }
}
