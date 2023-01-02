export interface IAccessTokenPayload {
  client_id: string
  client_secret: string
  code: string
  redirect_uri?: string
}

export interface IAccessTokenRes {
  access_token: string
  scope: string
  token_type: string
}

export interface ITokenMessage {
  isCloseCurrentTab: boolean
  isSuccess: boolean
  username?: string
  tokenType?: string
  token?: string
}
