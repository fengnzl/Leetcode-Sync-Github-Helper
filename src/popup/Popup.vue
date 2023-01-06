<script setup lang="ts">
import 'uno.css'
import { leetcodeSyncToken } from '~/logic/storage'
import { getAuthToken } from '~/logic/oauth2'
const showAuthenticate = computed(() => !leetcodeSyncToken.value)
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <h2 class="to-light-600 font-700 text-size-16px">
      Leetcode Sync GitHub Helper
    </h2>
    <template v-if="showAuthenticate">
      Authenticate with GitHub to use extension!
      <button class="btn mt-2" @click="getAuthToken">
        Authenticate
      </button>
    </template>
  </main>
</template>
