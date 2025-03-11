import { Grid } from '@/lib/grid'
import { TangoValue } from '../types'
import { TangoHint } from '.'
import { symbol } from '../rules'

/**
 * In the rare case that the other hints cannot determine a cell,
 * we fallback to picking a random cell from the solution.
 */
export const getFallbackHint = (
  grid: Grid<TangoValue>,
  solution: Grid<TangoValue>
): TangoHint => {
  const emptyCells = Grid.filterCells(grid, (cell) => cell === 0)

  const cellPosition = emptyCells[Math.floor(Math.random() * emptyCells.length)]

  const cellValue = Grid.getCellValue(solution, cellPosition)

  return {
    position: cellPosition,
    value: cellValue,
    reason: `This cell must be ${symbol(cellValue)}.`,
  }
}
