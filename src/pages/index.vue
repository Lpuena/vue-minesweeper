<script setup lang="ts">
import type { BlockState } from '~/types'

const HEIGHT = 10
const WIDTH = 10
const data = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  ))

// 生成地雷
function generateMines(initial: BlockState) {
  for (const row of data.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) < 1
      && Math.abs(initial.y - block.y) < 1)
        continue
      block.mine = Math.random() < 0.4
    }
  }
  updateNumbers()
}

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

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

// 计算格子的数字
function updateNumbers() {
  data.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines++
      })
    })
  })
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    return data.value[y2][x2]
  }).filter(Boolean) as BlockState[]
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10'
  return block.mine
    ? 'bg-red-500/50'
    : numberColor[block.adjacentMines]
}

function expendZero(block: BlockState) {
  if (block.adjacentMines === 0 || block.revealed)
    return
  getSiblings(block).forEach((s) => {
    s.revealed = true
    expendZero(s)
  })
}

let mineGenerated = false
// 开发模式
const dev = true
// 点击事件
function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine)
    alert('BOOOM!!')
  expendZero(block)
}
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
    <button
      v-for="(block, x) in row"
      :key="x"
      flex="~"
      border="1 gray-400/10"
      m-0.5
      h-10
      w-10
      items-center
      justify-center
      hover="bg-gray/10"
      :class="getBlockClass(block)"
      @click="onClick(block)"
    >
      <template v-if="block.revealed || dev">
        <div v-if="block.mine" i-mdi-mine />
        <div v-else>
          {{ block.adjacentMines }}
        </div>
      </template>
    </button>
  </div>
</template>

<style scoped>

</style>
