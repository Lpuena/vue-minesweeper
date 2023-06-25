<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(5, 5)
const data = play.data
</script>

<template>
  <div mb-8>
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
