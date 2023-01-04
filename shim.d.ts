import type { ProtocolWithReturn } from 'webext-bridge'
import type { ITokenMessage } from './src/Types'
import { TOKEN_MESSAGE_ID } from './src/config/oauth2';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    [TOKEN_MESSAGE_ID]: ITokenMessage;
    "get-current-tab": ProtocolWithReturn<
      { tabId: number },
      { title?: string }
    >;
  }
}
