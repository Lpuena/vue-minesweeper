<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev } from '~/composables'

defineProps<{ block: BlockState }>()

const numberColor = [
  'text-transparent',
  'text-green-400',
  'text-blue-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
  'text-purple-400',
  'text-pink-400',
  'text-teal-400',
]

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine
    ? 'bg-red-500/50'
    : numberColor[block.adjacentMines]
}
</script>

<template>
  <button
    flex="~"
    border="1 gray-400/10"
    m-0.5
    h-10
    w-10
    items-center
    justify-center
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>

<style scoped>
</style>
