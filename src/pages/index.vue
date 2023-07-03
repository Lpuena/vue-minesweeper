<script setup lang="ts">
import { GamePlay } from '~/composables/logic'

import { isDev, toggleDev } from '~/composables'

const play = new GamePlay(9, 9, 10)
useStorage('vuesweapper-state', play.data)
const data = computed(() => play.board)

const mineRest = computed(() => {
  if (!play.data.value.mineGenerated)
    return play.mines
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0) - (b.flagged ? 1 : 0), 0)
})

watchEffect(() => {
  play.checkGameState()
})

function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'medium':
      play.reset(16, 16, 40)
      break
    case 'hard':
      play.reset(30, 16, 99)
      break
  }
}

const now = useNow()
const countDown = computed(() => Math.round((+now.value - play.data.value.startTime) / 1000))
</script>

<template>
  <div mb-8 font-bold text-purple>
    Minesweeper
  </div>
  <div flex="~ gap1" justify-center p4>
    <button btn @click="play.reset()">
      New Game
    </button>
    <button btn @click="newGame('easy')">
      EASY
    </button>
    <button btn @click="newGame('medium')">
      MEDIUM
    </button>
    <button btn @click="newGame('hard')">
      HARD
    </button>
  </div>

  <div flex="~ gap1" justify-center font-mono text-2xl>
    <div i-carbon-timer />
    {{ countDown }}

    <div i-mdi-mine ml-5 />
    {{ mineRest }}
  </div>
  <div w-full overflow-auto p5>
    <div
      v-for="(row, y) in data"
      :key="y"
      flex="~"
      ma w-max items-center justify-center
    >
      <mine-block
        v-for="(block, x) in row"
        :key="x"
        :block="block"
        @click="play.onClick(block)"
        @contextmenu.prevent="play.onRightClick(block)"
      />
    </div>
  </div>

  <div flex="~ gap-1" mt-5 justify-center>
    <button btn @click="toggleDev()">
      {{ isDev ? 'DEV' : 'NORMAL' }}
    </button>

    <Confetti :passed="play.data.value.gameState === 'won'" />
  </div>
</template>

<style scoped>

</style>
