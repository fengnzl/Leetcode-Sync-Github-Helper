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
