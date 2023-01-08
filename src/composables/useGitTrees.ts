import type { ITrees, ITreesRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { githubOwnerRepo } from '~/logic/leetcode'
import { ENDNOTE } from '~/config/common'

// https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28
export const useGitTrees = () => {
  const treeSha = ref<string>('')
  async function getGitTrees(params: ITrees) {
    const { data, statusCode, error } = await usePost<ITreesRes, ITrees>(
      `/repos/${githubOwnerRepo}/git/trees`,
      params,
    )
    if (statusCode.value === 200 && !error.value)
      treeSha.value = data.value?.sha || ''
    else
      console.warn(`Error when getting trees sha - ${ENDNOTE}`)
  }
  return {
    getGitTrees,
    treeSha,
  }
}
