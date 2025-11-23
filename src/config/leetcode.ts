import type { ILeetcodeInfo } from '~/Types/leetcode'
export const MAX_INTERVAL_COUNT = 5
export const SUBMISSION_DETAIL_PREFIX = '/submissions/detail/'
export const LEETCODE_LANGUAGE = {
  'python': '.py',
  'python3': '.py',
  'c++': '.cpp',
  'c': '.c',
  'java': '.java',
  'c#': '.cs',
  'javascript': '.js',
  'ruby': '.rb',
  'swift': '.swift',
  'go': '.go',
  'kotlin': '.kt',
  'scala': '.scala',
  'rust': '.rs',
  'php': '.php',
  'typescript': '.ts',
  'mysql': '.sql',
  'ms sql server': '.sql',
  'oracle': '.sql',
}
const CN_LEETCODE_INFO: ILeetcodeInfo = {
  bottom: 214,
  right: 22,
  oldTitleSelector: 'div[data-cy="question-title"]',
  newTitleSelector: 'span[class*="text-label-1"]',
  oldSuccessSelector: 'div[data-cypress="SubmissionSuccess"]',
  newSuccessSelector: '[data-e2e-locator="submission-result"]',
  oldSubmitBtnSelector: 'button[data-cypress="SubmitCode"]',
  newSubmitBtnSelector: 'button[data-e2e-locator="console-submit-button"]',
  passStatusSelector: 'data__HC-i',
  BASE_URL: 'https://leetcode.cn/graphql/',
  rootSelectorId: 'app',
  newRootSelectorId: '__next',
  oldCodeSelector: '.custom-td__1SeH > .ac__g_mU',
  newCodeSelector: 'code',
  getProblemSolutionFn: getCnProblemSolution,
  passOldTableTdClass: '.custom-td__1SeH',
  passNewTableTdClass: 'span[class*=leading-]',
  oldNotesSelector: '.note__1Qo7',
}
const EN_LEETCODE_INFO: ILeetcodeInfo = {
  bottom: 214,
  right: 22,
  oldTitleSelector: 'div[data-cy="question-title"]',
  newTitleSelector: 'span[class*="text-label-1"]',
  oldSuccessSelector: '.success__3Ai7',
  newSuccessSelector: '[data-e2e-locator="submission-result"]',
  oldSubmitBtnSelector: 'button[data-cy="submit-code-btn"]',
  newSubmitBtnSelector: 'button[class*="text-label-"]',
  passStatusSelector: 'data__HC-i',
  BASE_URL: 'https://leetcode.com/graphql/',
  rootSelectorId: 'app',
  newRootSelectorId: '__next',
  oldCodeSelector: '.status-column__3SUg > .ac__35gz',
  newCodeSelector: 'code',
  getProblemSolutionFn: getEnProblemSolution,
  passOldTableTdClass: '.lang-column__tR-8',
  passNewTableTdClass: 'span[class*=leading-]',
  oldNotesSelector: '.note__1Qo7',
}
export function isLeetcodeCn() {
  return location.hostname === 'leetcode.cn'
}
export function getLeetcodeInfo(): ILeetcodeInfo {
  return isLeetcodeCn() ? CN_LEETCODE_INFO : EN_LEETCODE_INFO
}

// query problem info
export function getProblemInfoQuery(titleSlug: string) {
  return {
    operationName: 'questionData',
    variables: { titleSlug },
    query:
      'query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    difficulty\n    }\n}\n',
  }
}

// get solution
export function getEnProblemSolution(submissionId: number) {
  return {
    query:
      'query submissionDetails($submissionId: Int!) {submissionDetails(submissionId: $submissionId) {runtime\n    runtimeDisplay\n    runtimePercentile\n    memory\n    memoryDisplay\n    memoryPercentile\n   code\n    lang {\n      name\n      verboseName\n    }\n }\n}',
    variables: { submissionId },
  }
}
export function getCnProblemSolution(submissionId: number) {
  return {
    query:
      '\n    query submissionDetails($submissionId: ID!) {\n  submissionDetail(submissionId: $submissionId) {\n    code\n    timestamp\n    statusDisplay\n    isMine\n    runtimeDisplay: runtime\n    memoryDisplay: memory\n    memory: rawMemory\n    lang\n    langVerboseName\n   runtimePercentile\n    memoryPercentile\n  }\n}\n    ',
    variables: { submissionId },
  }
}

export function getProblemSubmissions(questionSlug: string) {
  return {
    operationName: 'submissions',
    variables: { offset: 0, limit: 40, lastKey: null, questionSlug },
    query:
      'query submissions($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!, $markedOnly: Boolean, $lang: String) {\n  submissionList(offset: $offset, limit: $limit, lastKey: $lastKey, questionSlug: $questionSlug, markedOnly: $markedOnly, lang: $lang) {\n    lastKey\n    hasNext\n    submissions {\n      id\n      statusDisplay\n      lang\n      runtime\n      timestamp\n      url\n      isPending\n      memory\n      submissionComment {\n        comment\n        flagType\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
  }
}
