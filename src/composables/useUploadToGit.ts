import { leetcodeAllOneCommitStorage, leetcodeProblemSha } from '../logic/storage'
import { LEETCODE_LANGUAGE } from '../config/leetcode'
import { useGithubReference } from './useGithubReference'
import { useFileBlob } from './useFileBlob'
import { useGitTrees } from './useGitTrees'
import { useCreateCommit } from './useCreateCommit'
import {
  checkProblemPassed,
  getProblemMd,
  getQuestionSolution,
  getQuestionTitle,
} from '~/logic/leetcode'
import type { ITree, IUploadAllOne } from '~/Types/github'
import type { LeetcodeLanguageType } from '~/Types/leetcode'
import { ENDNOTE } from '~/config/common'

/**
 * for first upload
 * 1.get readme, problem solution and etc.
 * 2.get current main branch commit https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference
 * 3.create every single file blob https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28
 * 4.create a tree https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28
 * 5.create a commit https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit
 * 6. update https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference
 *
 * for update only upload code
 */
export const useUploadToGit = () => {
  const isUploading = ref<boolean>(false)
  const uploadToGit = async () => {
    if (!checkProblemPassed())
      return
    const [markdown, codeInfo] = await Promise.all([
      getProblemMd(),
      getQuestionSolution(),
    ])
    if (!codeInfo)
      return
    const { enQuestionTitle, fullTitle } = getQuestionTitle()
    const { code, lang, memoryDisplay, memoryPercentile, runtimeDisplay, runtimePercentile } = codeInfo
    isUploading.value = true
    // firstUpload
    if (
      !leetcodeProblemSha.value[enQuestionTitle]
      && leetcodeAllOneCommitStorage.value
    ) {
      uploadToGitAllOne({
        markdown,
        code,
        msg: `Time: ${runtimeDisplay} (${runtimePercentile.toFixed(
          2,
        )}), Space: ${memoryDisplay} (${memoryPercentile.toFixed(
          2,
        )}) - ${ENDNOTE}`,
        lang: LEETCODE_LANGUAGE[lang as LeetcodeLanguageType],
        directory: fullTitle,
      }).finally(() => (isUploading.value = false))
    }
  }
  return {
    isUploading,
    uploadToGit,
  }
}

async function uploadToGitAllOne({
  markdown,
  code,
  msg,
  lang,
  directory,
}: IUploadAllOne): Promise<boolean> {
  const { getBranchRef, updateBranchRef, isUploadSuccess } = useGithubReference()
  const { getFileBlob } = useFileBlob()
  const [mainSha, codeBlobSha, mdBlobSha] = await Promise.all([
    getBranchRef(),
    getFileBlob({ content: code }),
    getFileBlob({ content: markdown }),
  ])
  if (!mainSha || !mdBlobSha || !codeBlobSha)
    return false
  const tree: ITree[] = [
    {
      path: `${directory}/${directory}${lang}`,
      mode: '100644',
      type: 'blob',
      sha: codeBlobSha,
    },
    {
      path: `${directory}/README.md`,
      mode: '100644',
      type: 'blob',
      sha: mdBlobSha,
    },
  ]
  const { treeSha, getGitTrees } = useGitTrees()
  await getGitTrees({
    tree,
    base_tree: mainSha,
  })
  if (!treeSha.value)
    return false
  const { commitSha, createCommit } = useCreateCommit()
  await createCommit({
    parents: [mainSha],
    message: msg,
    tree: treeSha.value,
  })
  if (!commitSha.value)
    return false
  await updateBranchRef({
    sha: commitSha.value,
  })
  return isUploadSuccess.value
}
