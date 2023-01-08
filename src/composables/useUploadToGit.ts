import {
  checkProblemPassed,
  getLanguage,
  getProblemMd,
  getQuestionSolution,
  getQuestionTitle,
  getTimeAndMemoryUsage,
} from '~/logic/leetcode'

/**
 * for first upload
 * 1.get readme, problem solution and etc.
 * 2.get current main branch commit https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference
 * 3.create every single file blob https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28
 * 4.create a tree https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28
 * 5.create a commit https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
 * 6. update https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference
 *
 * for update only upload code
 */
export const useUploadToGit = () => {
  const isUploading = ref<boolean>(false)
  const uploadToGit = async () => {
    if (!checkProblemPassed())
      return
    const [markdown, code, timeMemoryUsage] = await Promise.all([
      getProblemMd(),
      getQuestionSolution(),
      getTimeAndMemoryUsage(),
    ])
    const langExt = getLanguage()
    const { enQuestionTitle } = getQuestionTitle()

    // eslint-disable-next-line no-console
    console.log(markdown, code, timeMemoryUsage, langExt, enQuestionTitle)
  }
  return {
    isUploading,
    uploadToGit,
  }
}
