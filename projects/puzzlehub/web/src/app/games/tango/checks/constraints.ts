import { Grid, GridPosition } from '@/lib/Grid'
import { TangoValue, TangoConstraint } from '../types'
import { colPositions, rowPositions } from './test-utils'

export function* getGridConstraintViolations(
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): Iterable<GridPosition[]> {
  for (const constraint of constraints) {
    const posA = {
      row: constraint.row,
      col: constraint.col,
    }

    const posB =
      constraint.direction === 'row'
        ? { row: constraint.row, col: constraint.col + 1 }
        : { row: constraint.row + 1, col: constraint.col }

    const valueA = Grid.getCell(grid, posA)
    const valueB = Grid.getCell(grid, posB)

    if (valueA === 0 || valueB === 0) continue

    const isViolation =
      constraint.type === 'equal' ? valueA !== valueB : valueA === valueB

    if (isViolation) {
      yield [posA, posB]
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  const constraints: TangoConstraint[] = [
    {
      row: 0,
      col: 0,
      direction: 'row',
      type: 'equal',
    },
    {
      row: 2,
      col: 3,
      direction: 'col',
      type: 'opposite',
    },
  ]

  it.each([
    {
      name: 'finds no violations for an empty grid',
      grid: Grid.filled(4, 0),
      violations: [],
    },
    {
      name: 'finds no violations when constraints are satisfied',
      // prettier-ignore
      grid: [
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 2],
          [0, 0, 0, 1],
        ],
      violations: [],
    },
    {
      name: 'finds violations',
      // prettier-ignore
      grid: [
          [1, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 2],
          [0, 0, 0, 2],
        ],
      violations: [rowPositions(0, 0, 1), colPositions(3, 2, 3)],
    },
  ] satisfies Array<{
    name: string
    grid: Grid<TangoValue>
    violations: GridPosition[][]
  }>)('$name', ({ grid, violations }) => {
    const actualViolations = Array.from(
      getGridConstraintViolations(grid, constraints)
    )

    expect(actualViolations).toEqual(violations)
  })
}
