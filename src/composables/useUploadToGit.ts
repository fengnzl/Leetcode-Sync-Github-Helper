import { Buffer } from 'buffer'
import { leetcodeAllOneCommitStorage, leetcodeProblemSha, leetcodeProblemSolved, problemBasicInfoStorage } from '../logic/storage'
import type { IUploadSingleParam } from '../Types/github'
import { useGithubReference } from './useGithubReference'
import { useFileBlob } from './useFileBlob'
import { useGitTrees } from './useGitTrees'
import { useCreateCommit } from './useCreateCommit'
import { useUploadSingle } from './useUploadSingle'
import {
  checkProblemPassed,
  getProblemMd,
  getQuestionSolution,
} from '~/logic/leetcode'
import type { ITree, IUploadCommon } from '~/Types/github'

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
  const isUploadSuccess = ref(false)
  const isUploading = ref<boolean>(false)
  const uploadComplete = ref(false)
  const setCompleteStatus = () => {
    isUploading.value = false
    uploadComplete.value = true
    if (isUploadSuccess.value)
      setTimeout(() => (uploadComplete.value = false), 1500)
  }
  const uploadToGit = async (isManual = false) => {
    isUploadSuccess.value = false
    uploadComplete.value = false
    if (!checkProblemPassed() && !isManual)
      return
    isUploading.value = true
    const [mdInfo, codeInfo] = await Promise.all([
      getProblemMd(),
      getQuestionSolution(),
    ])
    if (!codeInfo) {
      setCompleteStatus()
      return
    }
    const { markdown, enQTitle, fullTitle } = mdInfo
    const { code, langExt, runtimeMemoryMsg } = codeInfo
    isUploading.value = true
    // firstUpload
    if (
      !leetcodeProblemSha.value[`${enQTitle}${langExt}`]
      && leetcodeAllOneCommitStorage.value
    ) {
      isUploadSuccess.value = await uploadToGitAllOne({
        enQTitle,
        markdown,
        code,
        msg: runtimeMemoryMsg,
        lang: langExt,
        directory: fullTitle,
      }).finally(setCompleteStatus)
    }
    else {
      isUploadSuccess.value = await uploadToGitSingle({
        enQTitle,
        markdown,
        code,
        msg: runtimeMemoryMsg,
        lang: langExt,
        directory: fullTitle,
      }).finally(setCompleteStatus)
    }
  }
  return {
    isUploading,
    uploadToGit,
    isUploadSuccess,
    uploadComplete,
  }
}

async function uploadToGitAllOne({
  enQTitle,
  markdown,
  code,
  msg,
  lang,
  directory,
}: IUploadCommon): Promise<boolean> {
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
  if (isUploadSuccess.value)
    updateShaAndSolved(codeBlobSha, enQTitle, lang)

  return isUploadSuccess.value
}

function updateShaAndSolved(sha: string, enTitle: string, ext: string) {
  const difficult = problemBasicInfoStorage.value[enTitle].difficulty
  leetcodeProblemSolved.value[difficult]++
  leetcodeProblemSha.value[`${enTitle}${ext}`] = sha
}

async function uploadToGitSingle({
  enQTitle,
  code,
  msg,
  lang,
  directory,
}: IUploadCommon): Promise<boolean> {
  const sha = leetcodeProblemSha.value[`${enQTitle}${lang}`] || ''
  const params: IUploadSingleParam = {
    sha,
    content: Buffer.from(code, 'utf-8').toString('base64'),
    message: msg,
    path: `${directory}/${directory}${lang}`,
  }
  const { uploadSha, isUploadSuccess, uploadSingle } = useUploadSingle()
  await uploadSingle(params)
  if (isUploadSuccess.value)
    leetcodeProblemSha.value[`${enQTitle}${lang}`] = uploadSha.value

  return isUploadSuccess.value
}
