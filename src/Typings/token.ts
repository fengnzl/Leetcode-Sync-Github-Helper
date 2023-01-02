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
