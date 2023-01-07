<script setup lang="ts">
import 'uno.css'
import { useSubmitStatus } from '~/composables/useSubmitStatus'
import { getLeetcodeInfo } from '~/config/leetcode'
import { useUploadToGit } from '~/composables/useUploadToGit'
const { bottom, right } = getLeetcodeInfo()

const innerHeight = window.innerHeight
const innerWidth = window.innerWidth
const dragContentWidth = 40
const dragContentHeight = 40

const posBottom = ref(bottom)
const posRight = ref(right)
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const right = innerWidth - e.clientX - dragContentWidth / 2
  posRight.value = right > 0 ? right : 0
  const bottom = innerHeight - e.clientY - dragContentHeight / 2
  posBottom.value = bottom > 0 ? bottom : 0
}

// check whether click submit button
const { isSubmitFinished, changeSubmitStatus } = useSubmitStatus()
const { uploadToGit } = useUploadToGit()
watch(isSubmitFinished, (newVal: boolean) => {
  if (newVal)
    changeSubmitStatus(false)
    // uploadToGit()
})
</script>

<template>
  <div
    :draggable="true"
    class="fixed z-100 flex font-sans select-none leading-1em"
    :style="`right: ${posRight}px;bottom:${posBottom}px`"
    @dragend="handleDrop"
  >
    <div
      class="bg-white text-gray-800 rounded-full shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
    >
      Vitesse WebExt
    </div>
    <div
      class="flex h-40px rounded-full shadow cursor-pointer"
      bg="teal-600 hover:teal-700"
      :style="`width: ${dragContentWidth}px; height: ${dragContentHeight}px`"
      @click="uploadToGit()"
    >
      <pixelarticons-power class="block m-auto text-white text-lg" />
    </div>
  </div>
</template>
