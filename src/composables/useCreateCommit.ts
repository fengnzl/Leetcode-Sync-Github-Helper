import type { ICreateCommit, ICreateCommitRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { githubOwnerRepo } from '~/logic/leetcode'
import { ENDNOTE } from '~/config/common'

// https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
export const useCreateCommit = () => {
  const commitSha = ref<string>('')
  async function createCommit(params: ICreateCommit) {
    const { data, statusCode, error }
      = await usePost<ICreateCommitRes, ICreateCommit>(
        `/repos/${githubOwnerRepo}/git/commits`,
        params,
      )
    if (statusCode.value === 200 && !error.value)
      commitSha.value = data.value?.sha || ''
    else
      console.warn(`Error when creating commit - ${ENDNOTE}`)
  }
  return {
    createCommit,
    commitSha,
  }
}
