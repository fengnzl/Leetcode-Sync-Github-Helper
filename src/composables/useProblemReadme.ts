import type { IProblemInfoRes } from '../Types/leetcode'
import { isLeetcodeCn } from '../config/leetcode'
import { useLeetcodePost } from './useLeetcodeFetch'
import { getProblemInfoQuery } from '~/config/leetcode'
import { ENDNOTE, LEETCODE_LEADING_COUNT } from '~/config/common'
import { leadingZero } from '~/logic/leetcode'
import { problemBasicInfoStorage } from '~/logic/storage'
export const useProblemReadme = () => {
  const readme = ref<string>('')
  const isReadmeError = ref<boolean>(false)
  const enQTitle = ref('')
  const fullTitle = ref('')
  async function getProblemReadme(title: string) {
    enQTitle.value = title
    const { data, error, statusCode } = await useLeetcodePost<IProblemInfoRes>({
      payload: getProblemInfoQuery(title),
    })
    if (error.value || statusCode.value !== 200) {
      isReadmeError.value = true
      console.warn(`Error when get problem info - ${ENDNOTE}`)
    }
    else {
      readme.value = getMarkdownInfo(data.value!)
      fullTitle.value = getFullTitle(data.value!, title)
      problemBasicInfoStorage.value[title] = {
        enQTitle: title,
        fullTitle: fullTitle.value,
        difficulty: data.value!.data.question.difficulty,
      }
    }
  }

  return {
    getProblemReadme,
    readme,
    isReadmeError,
    enQTitle,
    fullTitle,
  }
}

function getFullTitle(res: IProblemInfoRes, title: string): string {
  const { questionId } = res.data.question
  const leadingNum = leadingZero(`${questionId}`, LEETCODE_LEADING_COUNT)
  return `${leadingNum}-${title}`
}

function getMarkdownInfo(res: IProblemInfoRes): string {
  const { content, translatedContent, title, translatedTitle, difficulty }
    = res.data.question
  let qTitle = ''
  let qContent = ''
  if (isLeetcodeCn()) {
    qTitle = translatedTitle
    qContent = translatedContent
  }
  else {
    qTitle = title
    qContent = content
  }
  return `<h2><a href="${getQuestionUrl()}">${qTitle}</a></h2><h3>${difficulty}</h3><hr>${qContent}`
}

function getQuestionUrl(): string {
  let questionUrl = window.location.href
  let pos = questionUrl.lastIndexOf('/submissions/')
  if (pos === -1)
    pos = questionUrl.lastIndexOf('/description/')

  if (pos !== -1) {
    questionUrl = questionUrl.slice(
      0,
      pos + 1,
    )
  }
  return questionUrl
}

