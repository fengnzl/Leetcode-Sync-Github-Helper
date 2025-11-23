import { Buffer } from 'buffer'
import { leetcodeAllOneCommitStorage, leetcodeProblemNotesSha, leetcodeProblemSha, leetcodeProblemSolved, problemBasicInfoStorage, problemNotesInfoStorage } from '../logic/storage'
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
  const isShowFailMsg = ref(false)
  const setCompleteStatus = () => {
    isUploading.value = false
    uploadComplete.value = true
    setTimeout(() => (uploadComplete.value = false), 1500)
  }
  const resetStatus = () => {
    isUploadSuccess.value = false
    uploadComplete.value = false
    isShowFailMsg.value = false
  }
  const uploadToGit = async (isManual = false) => {
    resetStatus()
    if (!await checkProblemPassed() && !isManual)
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
    isShowFailMsg.value = !isUploadSuccess.value
  }
  return {
    isUploading,
    uploadToGit,
    isUploadSuccess,
    uploadComplete,
    isShowFailMsg,
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
  const requestArr = [
    getBranchRef,
    () => getFileBlob({ content: code! }),
    () => getFileBlob({ content: markdown }),
  ]
  const notesInfo = problemNotesInfoStorage.value[enQTitle]
  if (notesInfo)
    requestArr.push(() => getFileBlob({ content: notesInfo }))

  const [mainSha, codeBlobSha, mdBlobSha, notesBlobSha] = await Promise.all(requestArr.map(fn => fn()))
  if (!mainSha || !mdBlobSha || !codeBlobSha || (notesInfo && !notesBlobSha))
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
  if (notesInfo) {
    tree.push({
      path: `${directory}/NOTES.md`,
      mode: '100644',
      type: 'blob',
      sha: notesBlobSha,
    })
  }
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
    updateShaAndSolved(codeBlobSha, enQTitle, lang, notesBlobSha)

  return isUploadSuccess.value
}

function updateShaAndSolved(sha: string, enTitle: string, ext: string, notesSha?: string) {
  const difficult = problemBasicInfoStorage.value[enTitle].difficulty
  leetcodeProblemSolved.value[difficult]++
  leetcodeProblemSha.value[`${enTitle}${ext}`] = sha
  problemNotesInfoStorage.value[enTitle] = ''
  if (notesSha)
    leetcodeProblemNotesSha.value[enTitle] = notesSha
}

async function uploadToGitSingle({
  enQTitle,
  code,
  msg,
  lang,
  directory,
}: IUploadCommon): Promise<boolean> {
  const requestArr = [
    () =>
      uploadCode({
        enQTitle,
        code,
        msg,
        lang,
        directory,
      } as IUploadCommon),
  ]
  if (problemNotesInfoStorage.value[enQTitle]) {
    requestArr.push(() =>
      uploadNotes({
        enQTitle,
        msg,
        directory,
      } as IUploadCommon),
    )
  }
  const [uploadCodeSuccess, uploadNotesSuccess] = await Promise.all(requestArr.map(fn => fn()))

  return uploadCodeSuccess && uploadNotesSuccess
}

async function uploadNotes({ enQTitle, msg, directory }: IUploadCommon): Promise<boolean> {
  const sha = leetcodeProblemNotesSha.value[enQTitle] || ''
  const notesInfo = problemNotesInfoStorage.value[enQTitle]
  const params: IUploadSingleParam = {
    sha,
    content: Buffer.from(notesInfo, 'utf-8').toString('base64'),
    message: msg,
    path: `${directory}/NOTES.md`,
  }
  const { uploadSha, isUploadSuccess, uploadSingle } = useUploadSingle()
  await uploadSingle(params)
  if (isUploadSuccess.value) {
    leetcodeProblemNotesSha.value[enQTitle] = uploadSha.value
    problemNotesInfoStorage.value[enQTitle] = ''
  }

  return isUploadSuccess.value
}

async function uploadCode({
  enQTitle,
  code,
  msg,
  lang,
  directory,
}: IUploadCommon): Promise<boolean> {
  console.log('uploadCode')
  const sha = leetcodeProblemSha.value[`${enQTitle}${lang}`] || ''
  const params: IUploadSingleParam = {
    sha,
    content: Buffer.from(code!, 'utf-8').toString('base64'),
    message: msg,
    path: `${directory}/${directory}${lang}`,
  }
  const { uploadSha, isUploadSuccess, uploadSingle } = useUploadSingle()
  await uploadSingle(params)
  if (isUploadSuccess.value)
    leetcodeProblemSha.value[`${enQTitle}${lang}`] = uploadSha.value

  return isUploadSuccess.value
}
