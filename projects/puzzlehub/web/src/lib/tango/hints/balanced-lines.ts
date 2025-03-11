import { getLineCellPosition, Grid } from '@/lib/grid'
import { TangoValue } from '../types'
import { TangoHint } from '.'
import { LineCellValue } from './__internal'
import { nonEmptyValues, TANGO_RULES } from '../rules'

const getLineBalancedLinesHint = (
  values: TangoValue[]
): LineCellValue | null => {
  const maxOccurrences = values.length / 2

  const completeValue = nonEmptyValues.find(
    (v) => values.filter((x) => x === v).length === maxOccurrences
  )

  if (!completeValue) {
    return null
  }

  const firstEmptyCell = values.findIndex((x) => x === 0)

  if (firstEmptyCell === -1) {
    return null
  }

  return {
    cellIndex: firstEmptyCell,
    value: TangoValue.NonEmpty.flip(completeValue),
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('gives no hint when line is empty', () => {
    const grid: TangoValue[] = [0, 0, 0, 0]

    const hint = getLineBalancedLinesHint(grid)

    expect(hint).toBeNull()
  })

  it('gives no hint when no symbol has occurred max times', () => {
    const grid: TangoValue[] = [1, 0, 2, 0]

    const hint = getLineBalancedLinesHint(grid)

    expect(hint).toBeNull()
  })

  it('hints when one symbol is exhausted', () => {
    const grid: TangoValue[] = [1, 1, 0, 0]

    const hint = getLineBalancedLinesHint(grid)

    expect(hint).toEqual({
      cellIndex: 2,
      value: 2,
    })
  })

  it('hints when one symbol is exhausted and the other has one occurrence', () => {
    const grid: TangoValue[] = [0, 0, 2, 2, 1, 2]

    const hint = getLineBalancedLinesHint(grid)

    expect(hint).toEqual({
      cellIndex: 0,
      value: 1,
    })
  })
}

export const getBalancedLinesHint = (
  grid: Grid<TangoValue>
): TangoHint | null => {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    const hint = getLineBalancedLinesHint(cells)

    if (hint) {
      return {
        position: getLineCellPosition(line, hint.cellIndex),
        value: hint.value,
        reason: TANGO_RULES.lineBalance,
      }
    }
  }

  return null
}
