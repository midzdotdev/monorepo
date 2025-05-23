import { Grid, getLineCellPosition } from '@/lib/grid'
import { chunkConsecutive } from '@/lib/std/iterable/chunkConsecutive'
import type { TangoViolation } from '.'
import { MAX_CONSECUTIVE, TANGO_RULES } from '../rules'
import type { TangoValue } from '../types'

function* checkLineConsecutiveCells(values: TangoValue[]): Iterable<number[]> {
  const consecutiveCells = chunkConsecutive(
    values.map((value, cellIndex) => ({
      value,
      cellIndex,
    })),
    (lastChunk, item) => lastChunk.value === item.value
  ).filter((chunk) => chunk[0]?.value !== 0)

  for (const chunk of consecutiveCells) {
    if (chunk.length > MAX_CONSECUTIVE) {
      yield chunk.map(({ cellIndex }) => cellIndex)
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('returns no violations for an empty grid', () => {
    const cells: TangoValue[] = [0, 0, 0, 0]

    const violations = [...checkLineConsecutiveCells(cells)]

    expect(violations).toEqual([])
  })

  it.each([
    [1, 1, 0, 2],
    [2, 1, 0, 1],
    [1, 2, 0, 1],
  ] satisfies Array<TangoValue[]>)(
    'returns no violations when there are none',
    (...cells) => {
      const violations = [...checkLineConsecutiveCells(cells)]

      expect(violations).toEqual([])
    }
  )

  it('correctly returns violations', () => {
    const cells: TangoValue[] = [1, 1, 1, 2]

    const violations = [...checkLineConsecutiveCells(cells)]

    expect(violations).toEqual([[0, 1, 2]])
  })
}

export function* checkGridConsecutiveCells(
  grid: Grid<TangoValue>
): Iterable<TangoViolation> {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    for (const lineIndices of checkLineConsecutiveCells(cells)) {
      yield {
        cells: lineIndices.map((cellIndex) =>
          getLineCellPosition(line, cellIndex)
        ),
        reason: TANGO_RULES.consecutiveCells,
      }
    }
  }
}
