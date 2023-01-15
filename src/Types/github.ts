export interface ICreateRepos {
  name: string
  private: boolean
}
export interface IRepoInfoRes {
  id: number
  name: string
  full_name: string
  [key: string]: unknown
}
export type CreateReposStatusCode = 304 | 400 | 401 | 403 | 404 | 422

export type LinkReposStatusCode = 301 | 403 | 404

export interface IUploadPayload {
  message: string
  content: string
  sha: string
}
interface IUploadToGit extends IUploadPayload {
  directory: string
  filename: string
}
export type UploadFn = (payload: IUploadToGit) => Promise<void>

export interface IUploadRes {
  content: {
    sha: string
    [key: string]: any
  }
  [key: string]: any
}

export interface IReferenceRes {
  ref: string
  node_id: string
  url: string
  object: {
    type: string
    sha: string
    url: string
  }
}

export interface IReferenceUpdate {
  sha: string
  force?: boolean
}

export interface IFileBolb {
  content: string
  encodeing?: 'utf-8' | 'base64'
}

export interface IFileBolbRes {
  url: string
  sha: string
}

export interface ITree {
  path: string
  mode: '100644' | '100755' | '040000' | '160000' | '120000'
  type: 'blob' | 'tree' | 'commit'
  sha: string
}

export interface ITrees {
  base_tree: string
  tree: ITree[]
}
export interface ITreeRes extends ITree {
  size: number
  url: string
}

export interface ITreesRes {
  sha: string
  url: string
  tree: ITreeRes[]
}

export interface ICreateCommit {
  parents: string[]
  message: string
  tree: string
  [key: string]: any
}

export interface ICreateCommitRes {
  sha: string
  url: string
  [key: string]: any
}

export interface IUploadCommon {
  enQTitle: string
  markdown: string
  code?: string
  msg: string
  lang: string
  directory: string
}

export interface IUploadSingleReq {
  message: string
  content: string
  sha?: string
  [key: string]: any
}

export interface IUploadSingleParam extends IUploadSingleReq {
  path: string
}

export interface IUploadSingleRes {
  content: {
    sha: string
    [key: string]: any
  }
}
