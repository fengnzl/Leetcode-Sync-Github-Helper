import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    TOKEN_MESSAGE_ID: {
      isCloseCurrentTab: boolean;
      isSuccess: boolean,
      username?: string,
      tokenType?: string,
      token?: string,
    };
    "get-current-tab": ProtocolWithReturn<
      { tabId: number },
      { title?: string }
    >;
  }
}
