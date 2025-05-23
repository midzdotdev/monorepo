import { Grid } from '@/lib/grid'
import { first, take } from '@/lib/std/iterable'
import { uniquePuzzles } from '../__tests__/fixtures/puzzles/unique'
import { nonEmptyValues } from '../rules'
import { type TangoConstraint, type TangoMove, TangoValue } from '../types'
import { listViolations } from '../violations'

export function* solveTangoBruteForce(
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): Iterable<Grid<TangoValue>> {
  for (const _ of listViolations(grid, constraints)) {
    return
  }

  const firstEmptyCell = Grid.findCell(grid, TangoValue.isEmpty)

  if (!firstEmptyCell) {
    yield grid

    return
  }

  const possibleMoves = nonEmptyValues.map<TangoMove>((value) => ({
    value,
    position: firstEmptyCell,
  }))

  for (const move of possibleMoves) {
    const newGrid = Grid.setCell(grid, move.position, move.value)

    yield* solveTangoBruteForce(newGrid, constraints)
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('gives multiple solutions for a empty grid', () => {
    const grid = Grid.filled<TangoValue>(4, 0)

    const result = take(solveTangoBruteForce(grid, []), 2)

    expect(result).toEqual([
      [
        [1, 1, 2, 2],
        [1, 1, 2, 2],
        [2, 2, 1, 1],
        [2, 2, 1, 1],
      ],
      [
        [1, 1, 2, 2],
        [1, 2, 1, 2],
        [2, 1, 2, 1],
        [2, 2, 1, 1],
      ],
    ])
  })

  it('gives no solutions for an invalid grid', () => {
    const grid: Grid<TangoValue> = [
      [1, 1, 1, 2],
      [1, 1, 2, 2],
      [2, 2, 1, 1],
      [2, 2, 1, 1],
    ]

    const solution = first(solveTangoBruteForce(grid, []))

    expect(solution).toBeUndefined()
  })

  it('gives one solution for a unique puzzle', () => {
    const { grid, constraints, solution } = uniquePuzzles[0]

    const solutions = [...solveTangoBruteForce(grid, constraints)]

    expect(solutions).toHaveLength(1)

    expect(solutions[0]).toEqual(solution)
  })
}
