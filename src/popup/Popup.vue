<script setup lang="ts">
import 'uno.css'
import { githubRepoNameStorage, leetcodeSyncToken } from '~/logic/storage'
import { getAuthToken } from '~/logic/oauth2'
const showAuthenticate = computed(() => !leetcodeSyncToken.value)
const hasAttatched = computed(() => !!githubRepoNameStorage.value)
</script>

<template>
  <main class="px-4 py-5 text-center text-gray-700" :style="`width: ${hasAttatched ? '350px' : '300px'}`">
    <Logo width="30px" height="30px" />
    <h2 class="to-light-600 font-700 text-size-16px">
      Leetcode Sync GitHub Helper
    </h2>
    <template v-if="showAuthenticate">
      Authenticate with GitHub to use extension!
      <button class="btn mt-2" @click="getAuthToken">
        Authenticate
      </button>
    </template>
    <template v-if="hasAttatched">
      <ProblemSolved count-size="15px" total-size="20px" />
    </template>
  </main>
</template>
