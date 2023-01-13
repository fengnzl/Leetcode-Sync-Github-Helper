import { LEETCODE_LANGUAGE, MAX_INTERVAL_COUNT, SUBMISSION_DETAIL_PREFIX, getLeetcodeInfo, isNewUI } from '../config/leetcode'
import type { IParsedSolution, IProblemBasicInfo, IProblemInfoParsed } from '../Types/leetcode'
import { problemBasicInfoStorage } from './storage'
import { ENDNOTE, LEETCODE_LEADING_COUNT } from '~/config'
import { useProblemReadme } from '~/composables/useProblemReadme'
import type { IQuestionTitle, LeetcodeLanguageType } from '~/Types/leetcode'
import { useProblemSolution } from '~/composables/useProblemSolution'
const {
  oldSuccessSelector,
  newSuccessSelector,
  passStatusSelector,
  oldTitleSelector,
  newTitleSelector,
  oldCodeSelector,
  passOldTableTdClass,
  passNewTableTdClass,
} = getLeetcodeInfo()
function checkProblemPassedInOld(): Promise<boolean> {
  return new Promise((resolve) => {
    let count = 0
    setInterval(() => {
      const successEle = document.querySelector(
        oldSuccessSelector,
      ) as HTMLElement | null
      if (!successEle && count < MAX_INTERVAL_COUNT)
        count++

      else
        resolve(successEle?.innerText.trim() === 'Success')
    }, 800)
  })
}

function checkProblemPassedInNew(): Promise<boolean> {
  return new Promise((resolve) => {
    let count = 0
    setInterval(() => {
      const successEleArr = Array.from(
        document.querySelectorAll(newSuccessSelector),
      ).filter(elem => elem.querySelector('svg'))
      if (!successEleArr[0] && count < MAX_INTERVAL_COUNT) {
        count++
      }
      else {
        resolve(
          successEleArr[0]?.querySelector('span')?.innerText === 'Accepted',
        )
      }
    }, 800)
  })
}

export const checkProblemPassed = async (): Promise<boolean> => {
  // The passing state is not real-time
  return isNewUI() ? await checkProblemPassedInNew() : await checkProblemPassedInOld()
}

export function leadingZero(str: string, count: number) {
  const len = str.length
  return len >= count ? str : '0'.repeat(count - len) + str
}
export function getEnProblemTtile() {
  return location.pathname.match(/\/problems\/([a-zA-Z-0-9]*)\//)![1]
}
export function getQuestionTitle(): IQuestionTitle {
  const titleSelector = isNewUI() ? newTitleSelector : oldTitleSelector
  const titleEle = document.querySelector(titleSelector) as HTMLElement
  const [questionNum, questionTitle] = titleEle?.innerText
    ?.toLowerCase()
    .split('.') as string[]
  const title = questionTitle.trim().toLowerCase().replace(/\s+/g, '-')
  const enQuestionTitle = getEnProblemTtile()
  const leadingNum = leadingZero(questionNum, LEETCODE_LEADING_COUNT)
  return {
    questionNum: leadingNum,
    questionTitle: title,
    enQuestionTitle,
    fullTitle: leadingNum + enQuestionTitle,
  }
}

export async function getProblemMd(): Promise<IProblemInfoParsed> {
  const questionTitle = getEnProblemTtile()
  const { getProblemReadme, readme } = useProblemReadme()
  if (!problemBasicInfoStorage.value[questionTitle])
    await getProblemReadme(questionTitle)

  return {
    markdown: readme.value,
    ...(problemBasicInfoStorage.value[questionTitle] as IProblemBasicInfo),
  }
}

export const getTimeAndMemoryUsage: () => string = () => {
  const statusEleArr = document.getElementsByClassName(passStatusSelector)
  if (statusEleArr?.length === 0)
    return ''
  const [time, timePercent, usage, usagePercent] = Array.from(statusEleArr).map(ele => (ele as HTMLElement).textContent)
  return `Time: ${time} (${timePercent}), Space: ${usage} (${usagePercent}) - ${ENDNOTE}`
}

export async function getQuestionSolution(): Promise<IParsedSolution | null> {
  return isNewUI() ? await getSolutionInNew() : await getSolutionInOld()
}

async function getSolutionInNew(): Promise<IParsedSolution | null> {
  const submissionId = location.pathname.match(
    /\/submissions\/([0-9]*)\//,
  )?.[1]
  if (!submissionId)
    return null
  const { langExt, code, runtimeMemoryMsg, getSolution } = useProblemSolution()
  await getSolution(Number(submissionId))
  return {
    langExt: langExt.value,
    code: code.value,
    runtimeMemoryMsg: runtimeMemoryMsg.value,
  }
}

async function getSolutionInOld(): Promise<IParsedSolution | null> {
  const aEle = document.querySelector(oldCodeSelector) as HTMLAnchorElement
  const href = aEle?.getAttribute('href')
  if (!aEle || !href)
    return null
  const submissionId = href.slice(SUBMISSION_DETAIL_PREFIX.length, -1)
  if (!submissionId)
    return null
  const { langExt, code, runtimeMemoryMsg, getSolution } = useProblemSolution()
  await getSolution(Number(submissionId))
  return {
    langExt: langExt.value,
    code: code.value,
    runtimeMemoryMsg: runtimeMemoryMsg.value,
  }
}

export function getLanguage(): string | null {
  const tdClass = isNewUI() ? passNewTableTdClass : passOldTableTdClass
  const tdEle = document.querySelectorAll(tdClass)
  if (!tdEle?.length)
    return null
  const filterEle = Array.from(tdEle).filter(ele => (ele as HTMLElement).innerText.toLowerCase() in LEETCODE_LANGUAGE)
  if (!filterEle.length)
    return null
  return LEETCODE_LANGUAGE[(filterEle[0] as HTMLElement).innerText.toLowerCase() as LeetcodeLanguageType]
}

