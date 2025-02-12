import { Grid } from '@/lib/Grid'
import { TangoValue, TangoConstraint } from '../types'
import { isValidMove } from '../checks'
import { symbol } from '../utils'
import { TangoHint } from '../hints'

export const getConstraintHint = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): TangoHint | null => {
  for (const constraint of constraints) {
    const posA = {
      row: constraint.row,
      col: constraint.col,
    }

    const posB =
      constraint.direction === 'row'
        ? { row: constraint.row, col: constraint.col + 1 }
        : { row: constraint.row + 1, col: constraint.col }

    const cells = [posA, posB].map((pos) => ({
      position: pos,
      value: Grid.getCell(grid, pos),
    }))

    const filledCell = cells.find((x) => x.value !== 0)!
    const emptyCell = cells.find((x) => x.value === 0)!

    if (!filledCell || !emptyCell) {
      continue
    }

    const otherValue: TangoValue.NonEmpty =
      constraint.type === 'equal'
        ? (filledCell.value as TangoValue.NonEmpty)
        : filledCell.value === 1
          ? 2
          : 1

    const move = {
      position: emptyCell.position,
      value: otherValue,
    }

    if (isValidMove(grid, constraints, move)) {
      return {
        position: emptyCell.position,
        value: otherValue,
        reason: [
          'This cell must be ',
          symbol(otherValue),
          ' because cells either side of the constraint must be ',
          constraint.type === 'equal' ? 'equal' : 'different',
          '.',
        ].join(''),
      }
    }
  }
  return null
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should find hint for equal constraint', () => {
    const grid: Grid<TangoValue> = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    const constraints: TangoConstraint[] = [
      {
        type: 'equal',
        row: 0,
        col: 0,
        direction: 'row',
      },
    ]

    const hint = getConstraintHint(grid, constraints)
    expect(hint).not.toBeNull()
    expect(hint?.position).toEqual({ row: 0, col: 1 })
    expect(hint?.value).toBe(1)
  })

  it('should find hint for different constraint', () => {
    const grid: Grid<TangoValue> = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    const constraints: TangoConstraint[] = [
      {
        type: 'opposite',
        row: 0,
        col: 0,
        direction: 'row',
      },
    ]

    const hint = getConstraintHint(grid, constraints)
    expect(hint).not.toBeNull()
    expect(hint?.position).toEqual({ row: 0, col: 1 })
    expect(hint?.value).toBe(2)
  })

  it('should return null when no constraint-based hints available', () => {
    const grid: Grid<TangoValue> = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    const constraints: TangoConstraint[] = [
      {
        type: 'equal',
        row: 0,
        col: 0,
        direction: 'row',
      },
    ]

    const hint = getConstraintHint(grid, constraints)
    expect(hint).toBeNull()
  })
}
