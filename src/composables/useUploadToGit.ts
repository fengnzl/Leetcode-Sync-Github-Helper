import { checkProblemPassed, getLanguage, getProblemMd, getQuestionSolution, getTimeAndMemoryUsage } from '~/logic/leetcode'

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
    // eslint-disable-next-line no-console
    console.log(markdown, code, timeMemoryUsage, langExt)
  }
  return {
    isUploading,
    uploadToGit,
  }
}
