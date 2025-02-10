import { Grid } from '@/lib/Grid'
import { TangoValue, TangoConstraint } from '../types'
import { isValidMove } from '../checks'
import { symbol } from '../utils'
import { TangoHint } from '../hints'

export const getLineBalanceHint = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): TangoHint | null => {
  const gridSize = Grid.getSquareSize(grid)

  const checkLineBalance = (
    line: TangoValue[],
    emptyCellIndices: number[],
    isRow: boolean,
    lineIndex: number
  ): TangoHint | null => {
    const valueCounts = {
      1: line.filter((v) => v === 1).length,
      2: line.filter((v) => v === 2).length,
    }

    if (emptyCellIndices.length > 0) {
      // Check for max symbols of either type
      for (const value of [1, 2] as const) {
        const otherValue = value === 1 ? 2 : 1

        if (valueCounts[value] === gridSize / 2) {
          for (const idx of emptyCellIndices) {
            const position = isRow
              ? { row: lineIndex, col: idx }
              : { row: idx, col: lineIndex }

            if (
              isValidMove(grid, constraints, { position, value: otherValue })
            ) {
              return {
                position,
                value: otherValue,
                reason: [
                  'This cell must be ',
                  symbol(otherValue),
                  ' because this ',
                  isRow ? 'row ' : 'column ',
                  ' already has the maximum number of ',
                  symbol(value),
                ].join(''),
              }
            }
          }
        }
      }

      // Check if remaining spaces can only fit one arrangement
      if (
        emptyCellIndices.length === 2 &&
        valueCounts[1] + valueCounts[2] === 4
      ) {
        for (const value of [1, 2] as const) {
          const neededCount = gridSize / 2 - valueCounts[value]

          if (neededCount === 2) {
            for (const idx of emptyCellIndices) {
              const position = isRow
                ? { row: lineIndex, col: idx }
                : { row: idx, col: lineIndex }

              if (
                isValidMove(grid, constraints, {
                  position,
                  value: value,
                })
              ) {
                return {
                  position,
                  value,
                  reason: [
                    'This cell must be ',
                    symbol(value),
                    ' because this ',
                    isRow ? 'row ' : 'column ',
                    ' needs two more ',
                    symbol(value),
                    's to be balanced',
                  ].join(''),
                }
              }
            }
          }
        }
      }
    }
    return null
  }

  // Check rows and columns
  for (let i = 0; i < gridSize; i++) {
    const row = grid[i]
    const rowEmptyCells = row.reduce(
      (acc, v, idx) => (v === 0 ? [...acc, idx] : acc),
      [] as number[]
    )
    const rowHint = checkLineBalance(row, rowEmptyCells, true, i)
    if (rowHint) return rowHint

    const col = grid.map((r) => r[i])
    const colEmptyCells = col.reduce(
      (acc, v, idx) => (v === 0 ? [...acc, idx] : acc),
      [] as number[]
    )
    const colHint = checkLineBalance(col, colEmptyCells, false, i)
    if (colHint) return colHint
  }

  return null
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('checkLineBalanceHints', () => {
    it('should find hint when row has maximum suns', () => {
      const grid: Grid<TangoValue> = [
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
      const constraints: TangoConstraint[] = []

      const hint = getLineBalanceHint(grid, constraints)
      expect(hint).not.toBeNull()
      expect(hint?.position).toEqual({ row: 0, col: 2 })
      expect(hint?.value).toBe(2)
    })

    it('should find hint when column has maximum moons', () => {
      const grid: Grid<TangoValue> = [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
      const constraints: TangoConstraint[] = []

      const hint = getLineBalanceHint(grid, constraints)
      expect(hint).not.toBeNull()
      expect(hint?.position).toEqual({ row: 2, col: 0 })
      expect(hint?.value).toBe(1)
    })

    it('should find hint when only two spaces remain in row and need same symbol', () => {
      const grid: Grid<TangoValue> = [
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
      const constraints: TangoConstraint[] = []

      const hint = getLineBalanceHint(grid, constraints)
      expect(hint).not.toBeNull()
      expect(hint?.value).toBe(2)
    })
  })
}
