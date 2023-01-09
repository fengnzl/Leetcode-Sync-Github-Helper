<script setup lang="ts">
import 'uno.css'
import { useDraggable } from '@vueuse/core'
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
const { uploadToGit } = useUploadToGit()
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
    LCYG
  </div>
</template>
