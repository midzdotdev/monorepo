import { Grid } from '@/lib/grid'
import { TangoHint } from '.'
import { TangoValue } from '../types'

export const getIncorrectCellHint = (
  grid: Grid<TangoValue>,
  solution: Grid<TangoValue>
): TangoHint | null => {
  const incorrectPosition = Grid.findCell(
    grid,
    (cell, position) =>
      !TangoValue.isEmpty(cell) &&
      cell !== Grid.getCellValue(solution, position)
  )

  if (!incorrectPosition) {
    return null
  }

  const incorrectValue = Grid.getCellValue(
    grid,
    incorrectPosition
  ) as TangoValue.NonEmpty

  return {
    position: incorrectPosition,
    value: TangoValue.NonEmpty.flip(incorrectValue),
    reason: `This cell is incorrect.`,
  }
}
