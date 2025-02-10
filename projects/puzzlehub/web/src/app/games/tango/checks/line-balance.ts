import { getLineCellPosition, Grid, GridPosition } from '@/lib/Grid'
import { TangoValue } from '../types'

const nonEmptyValues: TangoValue[] = [1, 2]

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
): Iterable<GridPosition[]> {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    for (const violation of checkLineBalance(cells)) {
      yield violation.map((cellIndex) => getLineCellPosition(line, cellIndex))
    }
  }
}
