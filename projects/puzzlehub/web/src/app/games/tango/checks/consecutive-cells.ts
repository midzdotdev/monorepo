import { getLineCellPosition, Grid, GridPosition, Line } from '@/lib/Grid'
import { TangoValue } from '../types'
import { colPositions, rowPositions } from './test-utils'
import { chunkConsecutive } from '@/lib/misc/iterable/chunkConsecutive'

const MAX_CONSECUTIVE = 2

export function checkCellConsecutiveCells(
  grid: Grid<TangoValue>,
  position: GridPosition
): boolean {
  const value = Grid.getCell(grid, position)

  const lines = [
    {
      direction: 'row',
      lineIndex: position.row,
      cellIndex: position.col,
    },
    {
      direction: 'col',
      lineIndex: position.col,
      cellIndex: position.row,
    },
  ] satisfies Array<Line & { cellIndex: number }>

  for (const line of lines) {
    let lineConsecutive = 1

    // Check backwards
    for (let i = line.cellIndex - 1; i >= 0; i--) {
      if (lineConsecutive === MAX_CONSECUTIVE) {
        return false
      }

      const cellPosition = getLineCellPosition(line, i)

      if (Grid.getCell(grid, cellPosition) !== value) {
        break
      }

      lineConsecutive++
    }

    // Check forwards
    for (let i = line.cellIndex + 1; i < line.lineIndex; i++) {
      if (lineConsecutive === MAX_CONSECUTIVE) {
        return false
      }

      const cellPosition = getLineCellPosition(line, i)

      if (Grid.getCell(grid, cellPosition) !== value) {
        break
      }

      lineConsecutive++
    }
  }

  return true
}

function* checkLineConsecutiveCells(values: TangoValue[]): Iterable<number[]> {
  const consecutiveCells = chunkConsecutive(
    values.map((value, cellIndex) => ({
      value,
      cellIndex,
    })),
    (lastChunk, item) => lastChunk.value === item.value
  ).filter((chunk) => chunk[0]!.value !== 0)

  for (const chunk of consecutiveCells) {
    if (chunk.length > MAX_CONSECUTIVE) {
      yield chunk.map(({ cellIndex }) => cellIndex)
    }
  }
}

export function* checkGridConsecutiveCells(
  grid: Grid<TangoValue>
): Iterable<GridPosition[]> {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    for (const lineIndices of checkLineConsecutiveCells(cells)) {
      yield lineIndices.map((cellIndex) => getLineCellPosition(line, cellIndex))
    }
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it.each([
    {
      case: 'gives no violations for an empty grid',
      grid: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      violations: [],
    },
    {
      case: 'gives no violations for a grid with no consecutive cells',
      grid: [
        [1, 0, 1, 0],
        [2, 1, 2, 2],
        [1, 1, 0, 2],
        [2, 0, 0, 1],
      ],
      violations: [],
    },
    {
      case: 'gives violations for more than two consecutive cells',
      grid: [
        [1, 1, 1, 1],
        [1, 2, 2, 2],
        [1, 1, 1, 2],
        [2, 2, 2, 2],
      ],
      // prettier-ignore
      violations: [
        rowPositions(0, 0, 3),
        rowPositions(1, 1, 3),
        rowPositions(2, 0, 2),
        rowPositions(3, 0, 3),
        colPositions(0, 0, 2),
        colPositions(3, 1, 3),
      ],
    },
  ] satisfies Array<{
    case: string
    grid: Grid<TangoValue>
    violations: GridPosition[][]
  }>)('$case', ({ grid, violations }) => {
    const actualViolations = [...checkGridConsecutiveCells(grid)]

    expect(actualViolations).toEqual(violations)
  })
}
