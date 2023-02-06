<script setup lang="ts">
import 'uno.css'
import { gihubUserNameStorage, githubRepoNameStorage, leetcodeSyncToken } from '../logic/storage'
import { useCreateRepository } from '~/composables/useCreateRepository'
import { PickOptions } from '~/Types/options'
import { useAttatchRepository } from '~/composables/useAttatchRepository'
const pickOption = ref<PickOptions>(PickOptions.none)
const options = [
  {
    value: PickOptions.public,
    label: 'Create a new public repository',
  },
  {
    value: PickOptions.private,
    label: 'Create a new private repository',
  },
  {
    value: PickOptions.attatch,
    label: 'Attach an exist repository',
  },
]
const repoName = ref<string>('')
const errorMsg = ref<string>('')
const btnLoading = ref(false)
function checkValid(): boolean {
  const msg = []
  if (!pickOption.value)
    msg.push('Please pick an option')
  if (!repoName.value)
    msg.push('Please fill the repository name')

  errorMsg.value = msg.join(' and ')
  return msg.length === 0
}
const handleStarted = async () => {
  if (checkValid()) {
    const isAttatch = pickOption.value === PickOptions.attatch
    if (isAttatch && !gihubUserNameStorage.value) {
      leetcodeSyncToken.value = ''
      errorMsg.value = 'Authenticate error, Please authenticate first (left click the extension to processed)!'
      return
    }
    btnLoading.value = true
    const { data, message, isSuccess, isFetching } = isAttatch
      ? await useAttatchRepository(`${gihubUserNameStorage.value}/${repoName.value}`)
      : await useCreateRepository({
        name: repoName.value,
        private: pickOption.value === PickOptions.private,
      })

    errorMsg.value = message
    btnLoading.value = isFetching.value
    if (isSuccess)
      githubRepoNameStorage.value = data.value!.full_name
  }
}
const hasAttatched = computed(() => !!githubRepoNameStorage.value)
</script>

<template>
  <main class="h-100vh px-4 py-10 text-center">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-5xl" alt="extension icon">
    <h2 class="to-light-600 font-700 text-size-30px">
      Leetcode Sync GitHub Helper
    </h2>
    <template v-if="!hasAttatched">
      <div class="ml200px">
        <div class="flex items-center mt100px">
          <span class="text-16px text-black">Started with Sync Helper</span>
          <el-select v-model="pickOption" class="m-2 w-300px" placeholder="Please select a option">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="repoName" class="w-500px ml10px" placeholder="Repository name" />
        </div>
        <span v-if="errorMsg" class="flex ml-190px text-red text-16px" v-html="errorMsg" />
      </div>
      <div class="flex justify-end mr-200px mt-30px">
        <el-button type="primary" :loading="btnLoading" @click="handleStarted">
          <span class="text-black">Get Started</span>
        </el-button>
      </div>
    </template>
    <div v-else>
      <ProblemSolved count-size="24px" title-size="30px" />
    </div>
  </main>
  <div class="mb-4 text-center fixed bottom-10px left-50% translate-x--50%">
    Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
  </div>
</template>
