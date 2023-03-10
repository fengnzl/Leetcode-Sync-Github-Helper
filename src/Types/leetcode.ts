import type { LEETCODE_LANGUAGE } from '../config/leetcode'
export interface IProblemSolved {
  Easy: number
  Medium: number
  Hard: number
}
export interface IProblemBasicInfo {
  enQTitle: string
  fullTitle: string
  difficulty: keyof IProblemSolved
}
export type LeetcodeLanguageType = keyof typeof LEETCODE_LANGUAGE
export interface ILeetcodeInfo {
  bottom: number
  right: number
  oldTitleSelector: string
  newTitleSelector: string
  oldSuccessSelector: string
  newSuccessSelector: string
  oldSubmitBtnSelector: string
  newSubmitBtnSelector: string
  passStatusSelector: string
  BASE_URL: string
  rootSelectorId: 'app'
  newRootSelectorId: '__next'
  oldCodeSelector: string
  newCodeSelector: string
  getProblemSolutionFn: (submissionId: number) => Record<string, any>
  passOldTableTdClass: string
  passNewTableTdClass: string
  oldNotesSelector: string
}

export interface IPostConig<T> {
  url?: string
  payload?: T
}

export interface IQuestionTitle {
  questionNum: string
  questionTitle: string
  enQuestionTitle: string
  fullTitle: string
}

export interface IProblemInfoRes {
  data: {
    question: {
      content: string
      difficulty: keyof IProblemSolved
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
      memoryPercentile: number
      runtime: number
      runtimeDisplay: string
      runtimePercentile: number
      [key: string]: any
    }
  }
}

export interface IProblemCnSolutionRes {
  data: {
    submissionDetail: {
      code: string
      lang: string
      runtime: string
      memory: string
      rawMemory: string
      langVerboseName: string
      memoryDisplay: string
      memoryPercentile: number
      runtimeDisplay: string
      runtimePercentile: number
      [key: string]: any
    }
  }
}

export interface ISolutionInfo {
  code: string
  lang: string
  memoryDisplay: string
  memoryPercentile: number
  runtimeDisplay: string
  runtimePercentile: number
  [key: string]: any
}

export interface IParsedSolution {
  langExt: string
  code: string
  runtimeMemoryMsg: string
}

export interface IProblemInfoParsed {
  markdown: string
  enQTitle: string
  fullTitle: string
  [key: string]: any
}
