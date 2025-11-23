import 'uno.css'
import { sendMessage } from 'webext-bridge'
import { watch } from 'vue'
import { generateToken } from '../logic/storage'
import { useUserInfo } from '../composables/useUserInfo'
import { removeActiveCurrentTab } from '../logic/tabs'
import { TOKEN_MESSAGE_ID } from '~/config'
import { getAccesToken } from '~/composables/useAccessToken'
function getGitHubAuthToken() {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (!code) {
    generateToken.value = false
    removeActiveCurrentTab()
  }
  else {
    getToken(code!)
  }
}

async function getToken(code: string) {
  const { data, statusCode } = await getAccesToken(code)
  let isSuccessToken = false
  if (statusCode.value === 200) {
    const { statusCode, data: userInfo } = await useUserInfo(data.value!)
    if (statusCode.value === 200) {
      isSuccessToken = true
      sendMessage(
        TOKEN_MESSAGE_ID,
        {
          isCloseCurrentTab: true,
          isSuccess: true,
          username: userInfo.value?.login,
          tokenType: data.value?.token_type,
          token: data.value?.access_token,
        },
        'background',
      )
    }
  }
  if (!isSuccessToken) {
    sendMessage(
      TOKEN_MESSAGE_ID,
      {
        isCloseCurrentTab: true,
        isSuccess: false,
      },
      'background',
    )
  }
}

watch(generateToken, (newVal) => {
  if (newVal && window.location.host === 'github.com')
    getGitHubAuthToken()
})
