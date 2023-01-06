<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { getLeetcodeInfo } from '~/config/common'
const { bottom, right } = getLeetcodeInfo()

const innerHeight = window.innerHeight
const innerWidth = window.innerWidth
const dragContentWidth = 40
const dragContentHeight = 40

const [show, toggle] = useToggle(false)
const posBottom = ref(bottom)
const posRight = ref(right)
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  posRight.value = innerWidth - e.clientX - dragContentWidth / 2
  posBottom.value = innerHeight - e.clientY - dragContentHeight / 2
}
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
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      Vitesse WebExt
    </div>
    <div
      class="flex h-40px rounded-full shadow cursor-pointer"
      bg="teal-600 hover:teal-700"
      :style="`width: ${dragContentWidth}px; height: ${dragContentHeight}px`"
      @click="toggle()"
    >
      <pixelarticons-power class="block m-auto text-white text-lg" />
    </div>
  </div>
</template>
