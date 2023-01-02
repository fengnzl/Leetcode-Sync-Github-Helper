<script setup lang="ts">
import { leetcodeSyncToken } from '~/logic/storage'
const pickOption = ref<string>('')
const options: any = []
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 h-[calc(100vh-20 px)]">
    <img src="/assets/icon.svg" class="icon-btn mx-2 text-5xl" alt="extension icon">
    <h2 class="to-light-600 font-700 text-size-30px">
      Leetcode Sync GitHub Helper
    </h2>
    <div class="flex items-center">
      <span>Started with Sync Helper</span>
      <el-select v-model="pickOption" class="m-2" placeholder="Please select a option">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <input v-model="leetcodeSyncToken" class="border border-gray-400 rounded px-2 py-1 mt-2">
  </main>
  <footer>
    <div class="mb-4 text-center">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </div>
  </footer>
</template>
