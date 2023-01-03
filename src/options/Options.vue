<script setup lang="ts">
import { useCreateRepository } from '~/composables/useCreateRepository'
import { PickOptions } from '~/Typings/options'
const pickOption = ref<PickOptions>(PickOptions.none)
const options = [
  {
    value: 'pubic',
    label: 'Create a new public repository',
  },
  {
    value: 'private',
    label: 'Create a new private repository',
  },
  {
    value: 'attach',
    label: 'Attach an exist repository',
  },
]
const repoName = ref<string>('')
const errorMsg = ref<string>('')
function checkValid(): boolean {
  const msg = []
  if (!pickOption.value)
    msg.push('Please pick an option')
  if (!repoName.value)
    msg.push('Please fill the repository name')

  errorMsg.value = msg.join(' and ')
  return msg.length === 0
}
const handleStarted = () => {
  if (checkValid()) {
    if (pickOption.value !== PickOptions.attach) {
      useCreateRepository({
        name: repoName.value,
        private: pickOption.value === PickOptions.private,
      })
    }
  }
}
</script>

<template>
  <main class="h-100vh px-4 py-10 text-center">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-5xl" alt="extension icon">
    <h2 class="to-light-600 font-700 text-size-30px">
      Leetcode Sync GitHub Helper
    </h2>
    <div class="ml200px">
      <div class="flex items-center mt100px">
        <span class="text-16px text-black">Started with Sync Helper</span>
        <el-select v-model="pickOption" class="m-2 w-300px" placeholder="Please select a option">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="repoName" class="w-500px ml10px" placeholder="Repository name" />
      </div>
      <span v-if="errorMsg" class="flex ml-190px text-red">{{ errorMsg }}</span>
    </div>
    <div class="flex justify-end mr-200px mt-30px">
      <el-button class="text-black" type="primary" @click="handleStarted">
        Get Started
      </el-button>
    </div>

    <div class="mb-4 text-center" style="position: fixed;">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </div>
  </main>
</template>
