import { GridPosition } from '@/lib/Grid'

export const rowPositions = (
  row: number,
  fromCol: number,
  toCol: number
): GridPosition[] =>
  Array.from({ length: 1 + toCol - fromCol }, (_, i) => ({
    row,
    col: fromCol + i,
  }))

export const colPositions = (
  col: number,
  fromRow: number,
  toRow: number
): GridPosition[] =>
  Array.from({ length: 1 + toRow - fromRow }, (_, i) => ({
    col,
    row: fromRow + i,
  }))
