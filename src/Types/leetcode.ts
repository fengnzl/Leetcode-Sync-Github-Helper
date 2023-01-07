import type { LEETCODE_LANGUAGE } from '../config/leetcode'
export interface IProblemSolved {
  easy: number
  medium: number
  hard: number
}
export type LeetcodeLanguageType = keyof typeof LEETCODE_LANGUAGE
export interface ILeetcodeInfo {
  bottom: number
  right: number
  oldTitleSelector: string
  newTitleSelector: string
  successSelector: string
  submitBtnSelector: string
  passStatusSelector: string
  BASE_URL: string
  rootSelectorId: 'app'
  newRootSelectorId: '__next'
  oldCodeSelector: string
  newCodeSelector: string
  getProblemSolutionFn: (submissionId: number) => Record<string, any>
  passOldTableTdClass: string
  passNewTableTdClass: string
}

export interface IProblemShaValue {
  readme: boolean
  code: boolean
  note: boolean
}

export interface IPostConig<T> {
  url?: string
  payload?: T
}

export interface IQuestionTitle {
  questionNum: string
  questionTitle: string
}

export interface IProblemInfoRes {
  data: {
    question: {
      content: string
      difficulty: string
      titleSlug: string
      title: string
      translatedContent: string
      translatedTitle: string
      questionId: string
      [key: string]: any
    }
  }
}

export interface IProblemEnSolutionRes {
  data: {
    submissionDetails: {
      code: string
      lang: {
        name: string
        verboseName: string
      }
      memory: number
      memoryDisplay: string
      memoryPercentile: string
      runtime: number
      runtimeDisplay: string
      runtimePercentile: string
      [key: string]: any
    }
  }
}

export interface IProblemCnSolutionRes {
  data: {
    submissionDetail: {
      id: string
      code: string
      lang: string
      runtime: string
      memory: string
      rawMemory: string
      [key: string]: any
    }
  }
}
