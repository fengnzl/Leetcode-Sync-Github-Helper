<script setup lang="ts">
import { leetcodeProblemSolved } from '../logic/storage'
defineProps({
  titleSize: String,
  countSize: String,

})
const total = computed(() => Object.values(leetcodeProblemSolved.value).reduce((prev, count) => prev + count))
</script>

<template>
  <div class="text-center">
    <div :class="`text-size-${titleSize}`">
      Problems solved: {{ total }}
    </div>
    <div class="flex justify-center">
      <div class="text-#00af9b" :class="`text-size-${countSize}`">
        Easy: <span class="ml10px">{{ leetcodeProblemSolved.easy }}</span>
      </div>

      <div class="text-#ffb800 ml-20px mr-20px" :class="`text-size-${countSize}`">
        Medium: <span class="ml10px">{{ leetcodeProblemSolved.medium }}</span>
      </div>

      <div class="text-#ff2d55" :class="`text-size-${countSize}`">
        Hard: <span class="ml10px">{{ leetcodeProblemSolved.hard }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
