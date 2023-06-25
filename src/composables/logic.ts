import type { BlockState } from '~/types'

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

export class GamePlay {
  // 是否生成炸弹
  mineGenerated = false
  data = ref<BlockState[][]>([])

  constructor(public width: number, public height: number) {
    // TODO 移到外面
  // watch(checkGameState, () => {})
    watchEffect(() => this.checkGameState())
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.data.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    )
  }

  // 生成地雷
  generateMines(data: BlockState[][], initial: BlockState) {
    for (const row of data) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) < 1)
          continue
        if (Math.abs(initial.y - block.y) < 1)
          continue
        block.mine = Math.random() < 0.2
      }
    }
    this.updateNumbers()
  }

  // 计算格子的数字
  updateNumbers() {
    this.data.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines++
        })
      })
    })
  }

  // 获得旁边九宫格内八个相邻的数组
  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.data.value[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  // 展开周围的空白
  expendZero(block: BlockState) {
    if (block.adjacentMines || block.mine)
      return
    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }

  // 点击事件
  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(this.data.value, block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine)
      alert('BOOOM!!')
    this.expendZero(block)
  // checkGameState()
  }

  // 右键点击事件
  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
  // checkGameState()
  }

  // 检查游戏最终状态
  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.data.value.flat()
    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine))
        alert('You cheat!')
      else
        alert('You win!')
    }
  }
}
