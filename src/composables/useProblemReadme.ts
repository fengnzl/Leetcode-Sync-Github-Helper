import type { IProblemInfoRes } from '../Types/leetcode'
import { isLeetcodeCn } from '../config/leetcode'
import { useLeetcodePost } from './useLeetcodeFetch'
import { getProblemInfoQuery } from '~/config/leetcode'
import { ENDNOTE } from '~/config/common'
export const useProblemReadme = () => {
  const readme = ref<string>('')
  const isReadmeError = ref<boolean>(false)
  async function getProblemReadme(title: string) {
    const { data, error, statusCode } = await useLeetcodePost<IProblemInfoRes>({
      payload: getProblemInfoQuery(title),
    })
    if (error.value || statusCode.value !== 200) {
      isReadmeError.value = true
      console.warn(`Error when get problem info - ${ENDNOTE}`)
    }
    else {
      readme.value = getMarkdownInfo(data.value!)
    }
  }

  return {
    getProblemReadme,
    readme,
    isReadmeError,
  }
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
