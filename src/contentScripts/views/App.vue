<script setup lang="ts">
import 'uno.css'
import { useDebounceFn, useDraggable } from '@vueuse/core'
import { useSubmitStatus } from '~/composables/useSubmitStatus'
import { getLeetcodeInfo } from '~/config/leetcode'
import { useUploadToGit } from '~/composables/useUploadToGit'
const { bottom, right } = getLeetcodeInfo()

const innerHeight = window.innerHeight
const innerWidth = window.innerWidth
const initialWH = 48

const draggableContainer = ref<HTMLElement | null>(null)
const { style } = useDraggable(draggableContainer, {
  initialValue: { x: innerWidth - right - initialWH, y: innerHeight - bottom - initialWH },
  preventDefault: true,
})

// check whether click submit button
const { isSubmitFinished, changeSubmitStatus } = useSubmitStatus()
const { uploadToGit, isUploading, isUploadSuccess, uploadComplete } = useUploadToGit()
const debounceUploadToGit = useDebounceFn(uploadToGit, 300)
watch(isSubmitFinished, (newVal: boolean) => {
  if (newVal) {
    changeSubmitStatus(false)
    uploadToGit()
  }
})
</script>

<template>
  <div
    ref="draggableContainer"
    border="~ gray-400/30 rd-50%"
    shadow="~ hover:lg"
    class="fixed bg-$vp-c-bg select-none cursor-move z-24 w-48px h-48px flex justify-center items-center"
    style="touch-action:none;"
    :style="style"
  >
    <line-md:uploading-loop v-show="isUploading" class="text-24px c-#409eff" />
    <icon-park:source-code v-show="!isUploading" class="block m-auto text-white text-lg" @click="debounceUploadToGit" />
    <mdi:success-bold v-if="isUploadSuccess && uploadComplete" class="c-#67c23a text-24px" />
  </div>
</template>
