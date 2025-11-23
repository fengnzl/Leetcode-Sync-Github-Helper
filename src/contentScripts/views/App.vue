<script setup lang="ts">
import 'uno.css'
import { useDebounceFn, useDraggable } from '@vueuse/core'
import { vOnClickOutside } from '@vueuse/components'
import { useNotes } from '../../composables/useNotes'
import { problemNotesInfoStorage } from '../../logic/storage'
import { useSubmitStatus } from '~/composables/useSubmitStatus'
import { getLeetcodeInfo } from '~/config/leetcode'
import { useUploadToGit } from '~/composables/useUploadToGit'
import { getEnProblemTitle } from '~/logic/leetcode'

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
const { uploadToGit, isUploading, isUploadSuccess, uploadComplete, isShowFailMsg } = useUploadToGit()
const debounceUploadToGit = useDebounceFn(() => uploadToGit(true), 300)

// Handle immediate click (for user feedback)
// watch(isSubmitClicked, (newVal: boolean) => {
//   if (newVal) {
    // console.log('🚀 Submit clicked - waiting for completion...')
    // You can add immediate UI feedback here if needed
//   }
// })

// Handle submission completion (for actual upload)
watch(isSubmitFinished, (newVal: boolean) => {
  if (newVal) {
    console.log('✅ Submit finished - starting upload...')
    changeSubmitStatus(false)
    uploadToGit()
  }
})
const closeShowError = () => {
  isShowFailMsg.value = false
}

const { notesInfo } = useNotes()
watch(notesInfo, (newVal) => {
  // update or add notes
  if (newVal) {
    const enTitle = getEnProblemTitle()
    problemNotesInfoStorage.value[enTitle] = newVal
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
    <icon-park:source-code v-show="!isUploading && !uploadComplete && !isShowFailMsg" class="block m-auto text-white text-lg" />
    <mdi:success-bold v-if="isUploadSuccess && uploadComplete" class="c-#67c23a text-24px" />
    <div
      v-show="isShowFailMsg"
      v-on-click-outside="closeShowError"
      class="absolute right-50px bg-#303133 c-#fff w-290px rd-4px cursor-default"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
    >
      Somthing went wrong, <span class="c-#67c23a cursor-pointer" @click.stop="debounceUploadToGit">Click me</span> to reupload!
    </div>
    <icon-park-outline:link-cloud-faild v-if="isShowFailMsg" class="#F56C6C" />
  </div>
</template>
