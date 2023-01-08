import type { ICreateCommit, ICreateCommitRes } from '../Types/github'
import { usePost } from './useMyFetch'
import { ENDNOTE } from '~/config/common'
import { githubRepoNameStorage } from '~/logic/storage'

// https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
export const useCreateCommit = () => {
  const commitSha = ref<string>('')
  async function createCommit(params: ICreateCommit) {
    const { data, statusCode, error } = await usePost<
      ICreateCommitRes,
      ICreateCommit
    >(`/repos/${githubRepoNameStorage.value}/git/commits`, params)
    if (statusCode.value === 201 && !error.value)
      commitSha.value = data.value?.sha || ''
    else
      console.warn(`Error when creating commit - ${ENDNOTE}`)
  }
  return {
    createCommit,
    commitSha,
  }
}
