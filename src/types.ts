export interface BlockState {
  x: number
  y: number
  revealed: boolean // 是否被揭示
  mine?: boolean // 是否是地雷
  flagged?: boolean // 是否被标记
  adjacentMines: number // 周围地雷的数量
}
