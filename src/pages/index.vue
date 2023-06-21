<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  revealed?: boolean // 是否被揭示
  mine?: boolean // 是否是地雷
  flagged?: boolean // 是否被标记
  adjacentMines: number // 周围地雷的数量
}

const HEIGHT = 10
const WIDTH = 10
const data = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
      }),
    ),
  ))
// 生成地雷
function generateMines() {
  for (const row of data) {
    for (const block of row)
      block.mine = Math.random() < 0.4
  }
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
  data.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return
      directions.forEach(([dx, dy]) => {
        const x2 = x + dx
        const y2 = y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
          return
        if (data[y2][x2].mine)
          block.adjacentMines++
      })
    })
  })
}
function getBlockClass(block: BlockState) {
  return block.mine
    ? 'bg-red-500/50'
    : numberColor[block.adjacentMines]
}

generateMines()
updateNumbers()

function onClick(x: number, y: number) {
  // console.log(`Click at ${x},${y}`)
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
      v-for="(item, x) in row"
      :key="x"

      flex="~"

      border="1 gray-400/10"

      m-0.5 h-10 w-10 items-center justify-center hover:bg-gray
      :class="getBlockClass(item)"
      @click="onClick(x, y)"
    >
      <div v-if="item.mine" i-mdi:mine>
        x
      </div>
      <div v-else>
        {{ item.adjacentMines }}
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
