import { isLeetcodeCn } from '../config/leetcode'
import type { ISolutionInfo } from '../Types/leetcode'
import { useLeetcodePost } from './useLeetcodeFetch'
import { getLeetcodeInfo } from '~/config/leetcode'
import { ENDNOTE } from '~/config/common'
import type { IProblemCnSolutionRes, IProblemEnSolutionRes } from '~/Types/leetcode'

const { getProblemSolutionFn } = getLeetcodeInfo()
export const useProblemSolution = () => {
  const solutionInfo = ref<ISolutionInfo | null>(null)
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
        const { code, runtimeDisplay, runtimePercentile, memoryDisplay, memoryPercentile, lang } = (data.value! as IProblemCnSolutionRes).data.submissionDetail
        solutionInfo.value = {
          code,
          runtimeDisplay,
          runtimePercentile,
          memoryDisplay,
          memoryPercentile,
          lang,
        }
      }
      else {
        const {
          code,
          runtimeDisplay,
          runtimePercentile,
          memoryDisplay,
          memoryPercentile,
          lang,
        } = (data.value! as IProblemEnSolutionRes).data.submissionDetails
        solutionInfo.value = {
          code,
          runtimeDisplay,
          runtimePercentile,
          memoryDisplay,
          memoryPercentile,
          lang: lang.name,
        }
      }
    }
  }
  return {
    solutionInfo,
    isSolutionError,
    getSolution,
  }
}
