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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lost'
}

export class GamePlay {
  // 是否生成炸弹

  data = ref() as Ref<GameState>

  constructor(public width: number, public height: number) {
    // TODO 移到外面
  // watch(checkGameState, () => {})
    // watchEffect(() => this.checkGameState())
    this.reset()
  }

  get board() {
    return this.data.value.board
  }

  reset() {
    this.data.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
            revealed: false,
          }),
        ),
      ),
    }
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
    this.board.forEach((row) => {
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
      return this.board[y2][x2]
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
    if (this.data.value.gameState !== 'play')
      return
    if (!this.data.value.mineGenerated) {
      this.generateMines(this.board, block)
      this.data.value.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      this.data.value.gameState = 'lost'
      this.showAllMines()
      return
    }
    this.expendZero(block)
  // checkGameState()
  }

  // 右键点击事件
  onRightClick(block: BlockState) {
    if (this.data.value.gameState !== 'play')
      return
    if (block.revealed)
      return
    block.flagged = !block.flagged
  // checkGameState()
  }

  // 检查游戏最终状态
  checkGameState() {
    if (!this.data.value.mineGenerated)
      return
    const blocks = this.board.flat()
    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine)) {
        this.data.value.gameState = 'lost'
        this.showAllMines()
      }
      else { this.data.value.gameState = 'won' }
    }
  }

  // 游戏结束显示所有炸弹
  showAllMines() {
    this.board.flat().forEach((item) => {
      if (item.mine)
        item.revealed = true
    })
  }
}
