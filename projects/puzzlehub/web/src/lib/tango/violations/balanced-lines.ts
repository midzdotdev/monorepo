import { Grid, getLineCellPosition } from '@/lib/grid'
import type { TangoViolation } from '.'
import { TANGO_RULES, nonEmptyValues } from '../rules'
import type { TangoValue } from '../types'

function* checkLineBalance(values: TangoValue[]): Iterable<number[]> {
  const limit = values.length / 2

  for (const value of nonEmptyValues) {
    const positions = values.flatMap((cellValue, lineIndex) =>
      cellValue === value ? [lineIndex] : []
    )

    if (positions.length > limit) {
      yield positions
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it.each([
    {
      name: 'finds no violations for an empty line',
      values: [0, 0, 0, 0],
      violations: [],
    },
    {
      name: 'finds no violations for a full, balanced line',
      values: [1, 1, 2, 2],
      violations: [],
    },
    {
      name: 'finds violations for an unbalanced line',
      values: [1, 1, 1, 0],
      violations: [[0, 1, 2]],
    },
  ] satisfies Array<{
    name: string
    values: TangoValue[]
    violations: number[][]
  }>)('$name', ({ values, violations }) => {
    const actualViolations = Array.from(checkLineBalance(values))

    expect(actualViolations).toEqual(violations)
  })
}

export function* checkGridLinesBalance(
  grid: Grid<TangoValue>
): Iterable<TangoViolation> {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    for (const violation of checkLineBalance(cells)) {
      yield {
        cells: violation.map((cellIndex) =>
          getLineCellPosition(line, cellIndex)
        ),
        reason: TANGO_RULES.lineBalance,
      }
    }
  }
}
