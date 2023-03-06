<script setup lang="ts">
import { leetcodeProblemSolved } from '../logic/storage'
import 'uno.css'
defineProps({
  totalSize: String,
  countSize: String,

})
// const totalStyle = computed(() => `font-size:${}`)
const total = computed(() => Object.values(leetcodeProblemSolved.value).reduce((prev, count) => prev + count))
</script>

<template>
  <div class="text-center">
    <div :style="`font-size:${totalSize}`">
      Problems solved: {{ total }}
    </div>

    <div class="flex justify-center">
      <div class="text-#00af9b" :style="`font-size:${countSize}`">
        Easy: <span class="ml10px">{{ leetcodeProblemSolved.Easy }}</span>
      </div>

      <div class="text-#ffb800 ml-20px mr-20px" :style="`font-size:${countSize}`">
        Medium: <span class="ml10px">{{ leetcodeProblemSolved.Medium }}</span>
      </div>

      <div class="text-#ff2d55" :style="`font-size:${countSize}`">
        Hard: <span class="ml10px">{{ leetcodeProblemSolved.Hard }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
