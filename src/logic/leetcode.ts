import { LEETCODE_LANGUAGE, SUBMISSION_DETAIL_PREFIX, getLeetcodeInfo, isNewUI } from '../config/leetcode'
import { gihubUserNameStorage, githubRepoNameStorage, leetcodeProblemSha } from './storage'
import { ENDNOTE, LEETCODE_LEADING_COUNT } from '~/config'
import { useProblemReadme } from '~/composables/useProblemReadme'
import type { IQuestionTitle, LeetcodeLanguageType } from '~/Types/leetcode'
import { useProblemSolution } from '~/composables/useProblemSolution'
const {
  successSelector,
  passStatusSelector,
  oldTitleSelector,
  newTitleSelector,
  oldCodeSelector,
  newCodeSelector,
  passOldTableTdClass,
  passNewTableTdClass,
} = getLeetcodeInfo()

export const checkProblemPassed: () => boolean = () => {
  const successEle = document.querySelector(
    successSelector,
  ) as HTMLElement | null
  return successEle?.innerText.trim() === 'Success'
}

function leadingZero(str: string, count: number) {
  const len = str.length
  return len >= count ? str : '0'.repeat(count - len) + str
}
function getEnProblemTtile() {
  return location.pathname.match(/\/problems\/([a-zA-Z-0-9]*)\//)![1]
}
export function getQuestionTitle(): IQuestionTitle {
  const titleSelector = isNewUI() ? newTitleSelector : oldTitleSelector
  const titleEle = document.querySelector(titleSelector) as HTMLElement
  const [questionNum, questionTitle] = titleEle?.innerText
    ?.toLowerCase()
    .split('.') as string[]
  const title = questionTitle.trim().toLowerCase().replace(/\s+/g, '-')
  return {
    questionNum: leadingZero(questionNum, LEETCODE_LEADING_COUNT),
    questionTitle: title,
    enQuestionTitle: getEnProblemTtile(),
  }
}

export async function getProblemMd(): Promise<string> {
  const questionTitle = getEnProblemTtile()
  const sha = leetcodeProblemSha.value[questionTitle]
  let markdown = ''
  if (!sha?.readme) {
    const { getProblemReadme, readme } = useProblemReadme()
    await getProblemReadme(questionTitle)
    markdown = readme.value
  }
  return markdown
}

export const getTimeAndMemoryUsage: () => string = () => {
  const statusEleArr = document.getElementsByClassName(passStatusSelector)
  if (statusEleArr?.length === 0)
    return ''
  const [time, timePercent, usage, usagePercent] = Array.from(statusEleArr).map(ele => (ele as HTMLElement).textContent)
  return `Time: ${time} (${timePercent}), Space: ${usage} (${usagePercent}) - ${ENDNOTE}`
}

export async function getQuestionSolution(): Promise<string> {
  if (isNewUI())
    return getSolutionInNew()

  else
    return await getSolutionInOld()
}

function getSolutionInNew(): string {
  const codeEle = document.getElementsByTagName(newCodeSelector)[0]
  return codeEle ? Array.from(codeEle.children).map(child => (child as HTMLElement).innerText).join() : ''
}

async function getSolutionInOld(): Promise<string> {
  const aEle = document.querySelector(oldCodeSelector) as HTMLAnchorElement
  const href = aEle?.getAttribute('href')
  if (!aEle || !href)
    return ''
  const submissionId = href.slice(SUBMISSION_DETAIL_PREFIX.length, -1)
  if (!submissionId)
    return ''
  const { code, getSolution } = useProblemSolution()
  await getSolution(Number(submissionId))
  return code.value
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

export const githubOwnerRepo = computed(
  () => `${gihubUserNameStorage.value}/${githubRepoNameStorage.value}`,
)
