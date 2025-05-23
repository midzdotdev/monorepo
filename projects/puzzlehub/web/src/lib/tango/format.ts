import { Grid } from '@/lib/grid'
import { uniquePuzzles } from './__tests__/fixtures/puzzles/unique'
import type { TangoConstraint, TangoValue } from './types'

export const formatPuzzle = (
  grid: Grid<TangoValue>,
  constraints: TangoConstraint[]
) => {
  let str = ''
  const gridSize = Grid.getSquareSize(grid)

  // Draw top border
  str += '┌'
  for (let col = 0; col < gridSize; col++) {
    str += `───${col < gridSize - 1 ? '┬' : '┐'}`
  }
  str += '\n'

  for (const [rowIndex, row] of grid.entries()) {
    // Draw cells and vertical separators
    str += '│'
    for (const [colIndex, cell] of row.entries()) {
      const cellText = cell === 0 ? ' ' : cell === 1 ? '☀️' : '◑'

      str += ` ${cellText} `

      const rightConstraint = constraints.find(
        (c) => c.direction === 'row' && c.row === rowIndex && c.col === colIndex
      )

      const rowCellSeparator = rightConstraint
        ? rightConstraint.type === 'equal'
          ? '='
          : '✖️'
        : '│'

      str += rowCellSeparator
    }
    str += '\n'

    // Draw horizontal separators if not last row
    if (rowIndex < gridSize - 1) {
      str += '├'
      for (let colIndex = 0; colIndex < gridSize; colIndex++) {
        const bottomConstraint = constraints.find(
          (c) =>
            c.direction === 'col' && c.row === rowIndex && c.col === colIndex
        )

        const colCellSeparator = bottomConstraint
          ? bottomConstraint.type === 'equal'
            ? 'ǁ'
            : '✖️'
          : '─'

        str += `─${colCellSeparator}─`
        str += colIndex < gridSize - 1 ? '┼' : '┤'
      }
      str += '\n'
    }
  }

  // Draw bottom border
  str += '└'
  for (let col = 0; col < gridSize; col++) {
    str += `───${col < gridSize - 1 ? '┴' : '┘'}`
  }
  str += '\n'

  return str
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest

  test('formatPuzzle', () => {
    const puzzle = uniquePuzzles[0]

    const formatted = formatPuzzle(puzzle.grid, puzzle.constraints)

    expect(formatted).toMatchInlineSnapshot(`
      "┌───┬───┬───┬───┬───┬───┐
      │   │   │ ◑ │ ◑ │   │   │
      ├─✖️─┼─✖️─┼───┼───┼─ǁ─┼─✖️─┤
      │   │   │   │   │   │   │
      ├───┼───┼─✖️─┼─✖️─┼───┼───┤
      │   =   │   │   │   =   │
      ├───┼───┼───┼───┼───┼───┤
      │   =   │   │   │   =   │
      ├───┼───┼─✖️─┼─✖️─┼───┼───┤
      │   │   │   │   │   │   │
      ├─ǁ─┼─ǁ─┼───┼───┼─✖️─┼─ǁ─┤
      │   │   │   =   │   │   │
      └───┴───┴───┴───┴───┴───┘
      "
    `)
  })
}
