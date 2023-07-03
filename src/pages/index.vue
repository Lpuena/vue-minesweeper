<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

import { isDev, toggleDev } from '~/composables'

const play = new GamePlay(12, 12, 30)
useStorage('vuesweapper-state', play.data)
const data = computed(() => play.board)

const mineCount = computed(() => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
})

watchEffect(() => {
  play.checkGameState()
})
</script>

<template>
  <div mb-8 font-bold text-purple>
    Minesweeper
  </div>
  <div
    v-for="(row, y) in data"
    :key="y"
    flex="~"
    items-center
    justify-center
  >
    <mine-block
      v-for="(block, x) in row"
      :key="x"
      :block="block"
      @click="play.onClick(block)"
      @contextmenu.prevent="play.onRightClick(block)"
    />
  </div>
  <div>count{{ mineCount }}</div>

  <div flex="~ gap-1" mt-5 justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'DEV' : 'NORMAL' }}
    </button>
    <button btn @click="play.reset()">
      RESET
    </button>
  </div>
</template>

<style scoped>

</style>
