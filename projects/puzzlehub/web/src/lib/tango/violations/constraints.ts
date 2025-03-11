import { Grid } from '@/lib/grid'
import { TangoValue, TangoConstraint } from '../types'
import { linePositions } from '../__tests__/utils'
import { TangoViolation } from '.'
import { TANGO_RULES } from '../rules'

export function* checkGridConstraints(
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
): Iterable<TangoViolation> {
  for (const constraint of constraints) {
    const posA = {
      row: constraint.row,
      col: constraint.col,
    }

    const posB =
      constraint.direction === 'row'
        ? { row: constraint.row, col: constraint.col + 1 }
        : { row: constraint.row + 1, col: constraint.col }

    const valueA = Grid.getCellValue(grid, posA)
    const valueB = Grid.getCellValue(grid, posB)

    if (valueA === 0 || valueB === 0) continue

    const isViolation =
      constraint.type === 'equal' ? valueA !== valueB : valueA === valueB

    if (isViolation) {
      yield {
        cells: [posA, posB],
        reason:
          constraint.type === 'equal'
            ? TANGO_RULES.equalConstraint
            : TANGO_RULES.oppositeConstraint,
      }
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
      violations: [
        {
          cells: linePositions('row', 0, 0, 1),
          reason: TANGO_RULES.equalConstraint,
        },
        {
          cells: linePositions('col', 3, 2, 3),
          reason: TANGO_RULES.oppositeConstraint,
        },
      ],
    },
  ] satisfies Array<{
    name: string
    grid: Grid<TangoValue>
    violations: TangoViolation[]
  }>)('$name', ({ grid, violations }) => {
    const actualViolations = Array.from(checkGridConstraints(grid, constraints))

    expect(actualViolations).toEqual(violations)
  })
}
