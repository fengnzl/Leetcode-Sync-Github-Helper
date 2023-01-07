import { isLeetcodeCn } from '../config/leetcode'
import { useLeetcodePost } from './useLeetcodeFetch'
import { getLeetcodeInfo } from '~/config/leetcode'
import { ENDNOTE } from '~/config/common'
import type { IProblemCnSolutionRes, IProblemEnSolutionRes } from '~/Types/leetcode'

const { getProblemSolutionFn } = getLeetcodeInfo()
export const useProblemSolution = () => {
  const code = ref<string>('')
  const isSolutionError = ref<boolean>(false)
  async function getSolution(submissionId: number) {
    const { data, statusCode, error }
      = await useLeetcodePost<IProblemCnSolutionRes | IProblemEnSolutionRes>({
        payload: getProblemSolutionFn(submissionId),
      })
    if (error.value || statusCode.value !== 200) {
      isSolutionError.value = true
      console.warn(`Error when get problem info - ${ENDNOTE}`)
    }
    else {
      if (isLeetcodeCn()) {
        code.value = (
          data.value! as IProblemCnSolutionRes
        ).data.submissionDetail.code
      }
      else {
        code.value = (
          data.value! as IProblemEnSolutionRes
        ).data.submissionDetails.code
      }
    }
  }
  return {
    code,
    isSolutionError,
    getSolution,
  }
}
