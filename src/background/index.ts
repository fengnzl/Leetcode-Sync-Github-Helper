import { onMessage } from 'webext-bridge'
import { TOKEN_MESSAGE_ID } from '../config/oauth2'

onMessage(TOKEN_MESSAGE_ID, ({ data }) => {
  // eslint-disable-next-line no-console
  console.log(`[vitesse-webext] ${JSON.stringify(data)}`)
})

