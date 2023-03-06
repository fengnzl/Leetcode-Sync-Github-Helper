<script setup lang="ts">
defineProps({
  width: String,
  height: String,
})
</script>

<template>
  <a class="icon-btn mx-2 text-2xl" rel="noreferrer" href="https://github.com/fengnzl/Leetcode-Sync-Github-Helper" target="_blank" title="GitHub">
    <IconParkTwotoneSourceCode :style="`width: ${width};height: ${height}`" />
  </a>
</template>
