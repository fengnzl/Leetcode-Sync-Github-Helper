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
