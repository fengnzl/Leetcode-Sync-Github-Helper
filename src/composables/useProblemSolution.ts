import { LEETCODE_LANGUAGE, isLeetcodeCn } from '../config/leetcode'
import type { ISolutionInfo, LeetcodeLanguageType } from '../Types/leetcode'
import { useLeetcodePost } from './useLeetcodeFetch'
import { getLeetcodeInfo } from '~/config/leetcode'
import { ENDNOTE } from '~/config/common'
import type { IProblemCnSolutionRes, IProblemEnSolutionRes } from '~/Types/leetcode'

const { getProblemSolutionFn } = getLeetcodeInfo()
export const useProblemSolution = () => {
  const solutionInfo = ref<ISolutionInfo | null>(null)
  const runtimeMemoryMsg = ref('')
  const isSolutionError = ref<boolean>(false)
  const langExt = ref('')
  const code = ref('')
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
        solutionInfo.value = (
          data.value! as IProblemCnSolutionRes
        ).data.submissionDetail
      }
      else {
        const parsedVal = (data.value! as IProblemEnSolutionRes).data.submissionDetails
        solutionInfo.value = {
          ...parsedVal,
          lang: parsedVal.lang.name,
        }
      }
      runtimeMemoryMsg.value = getRuntimeMemoryMsg(solutionInfo.value)
      langExt.value
        = LEETCODE_LANGUAGE[solutionInfo.value.lang as LeetcodeLanguageType]
      code.value = solutionInfo.value.code
    }
  }
  return {
    solutionInfo,
    runtimeMemoryMsg,
    isSolutionError,
    langExt,
    code,
    getSolution,
  }
}

function getRuntimeMemoryMsg(data: ISolutionInfo | null): string {
  if (!data)
    return ''
  const { runtimeDisplay, runtimePercentile, memoryDisplay, memoryPercentile } = data
  return `Time: ${runtimeDisplay} (${runtimePercentile.toFixed(2)}%), Space: ${memoryDisplay} (${memoryPercentile.toFixed(2)}%) - ${ENDNOTE}`
}
