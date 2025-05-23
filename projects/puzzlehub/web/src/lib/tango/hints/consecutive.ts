import { Grid, getLineCellPosition } from '@/lib/grid'
import type { TangoHint } from '.'
import { symbol } from '../rules'
import { TangoValue } from '../types'
import type { LineCellValue } from './__internal'

/**
 * Example: `[1, 0, 1, 0]` must become `[1, 2, 1, 0]`
 * Example: `[0, 1, 1, 2]` must become `[2, 1, 1, 2]`
 * Example: `[2, 1, 1, 0]` must become `[2, 1, 1, 2]`
 */
const getLineTripletHint = (
  values: TangoValue[]
): LineCellValue<TangoValue.NonEmpty> | null => {
  for (let i = 1; i < values.length - 1; i++) {
    // Get a triplet of previous, current and next cells
    const cells = [
      {
        cellIndex: i - 1,
        value: values[i - 1],
      },
      {
        cellIndex: i,
        value: values[i],
      },
      {
        cellIndex: i + 1,
        value: values[i + 1],
      },
    ]

    const nonEmptyCells = cells.filter(
      (x): x is LineCellValue<TangoValue.NonEmpty> => x.value !== 0
    )

    // Ensure there are two non-empty cells and they have the same value
    if (
      nonEmptyCells.length !== 2 ||
      nonEmptyCells[0].value !== nonEmptyCells[1].value
    )
      continue

    // The above means the empty cell will always be found
    const emptyCell = cells.find((x) => x.value === 0)

    if (!emptyCell) {
      throw new Error('Incorrect state: no empty cell found')
    }

    const nonEmptyValue = nonEmptyCells[0].value

    return {
      cellIndex: emptyCell.cellIndex,
      value: TangoValue.NonEmpty.flip(nonEmptyValue),
    }
  }

  return null
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should find hint for a 1s either side a 0', () => {
    const values: TangoValue[] = [1, 0, 1, 0]

    const actual = getLineTripletHint(values)

    expect(actual).toEqual({
      cellIndex: 1,
      value: 2,
    })
  })

  it('should find hint for a pair of 1s after a 0', () => {
    const values: TangoValue[] = [0, 1, 1, 2]

    const actual = getLineTripletHint(values)

    expect(actual).toEqual({
      cellIndex: 0,
      value: 2,
    })
  })

  it('hints for a pair of 1s before a 0', () => {
    const values: TangoValue[] = [2, 1, 1, 0]

    const actual = getLineTripletHint(values)

    expect(actual).toEqual({
      cellIndex: 3,
      value: 2,
    })
  })

  it('hints for a pair of 2s surrounded by 0s', () => {
    const values: TangoValue[] = [0, 0, 2, 2, 0, 0]

    const actual = getLineTripletHint(values)

    expect(actual).toEqual({
      cellIndex: 1,
      value: 1,
    })
  })
}

/**
 * Example: `[1, 0, 0, 0, 2, 1]` must become `[1, 2, 0, 0, 2, 1]`
 * Example: `[1, 2, 0, 0, 0, 1]` must become `[1, 2, 0, 0, 2, 1]`
 */
const getLineNoForcingThreeInARowHint = (
  values: TangoValue[]
): LineCellValue<TangoValue.NonEmpty> | null => {
  for (let i = 0; i < values.length - 5; i++) {
    const startValue = values[i]
    const endValue = values[i + 5]

    if (startValue !== endValue || startValue === 0) continue

    const innerEdges = [
      {
        cellIndex: i + 1,
        value: values[i + 1],
      },
      {
        cellIndex: i + 4,
        value: values[i + 4],
      },
    ]

    const emptyInner = innerEdges.find(
      (x): x is LineCellValue<TangoValue.NonEmpty> => x.value === 0
    )

    if (!emptyInner) continue

    const hintValue = TangoValue.NonEmpty.flip(startValue)

    return {
      cellIndex: emptyInner.cellIndex,
      value: hintValue,
    }
  }

  return null
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('hints when a symbol encloses 4 cells with an empty inner left', () => {
    const values: TangoValue[] = [1, 0, 0, 0, 2, 1]

    const actual = getLineNoForcingThreeInARowHint(values)

    expect(actual).toEqual({
      cellIndex: 1,
      value: 2,
    })
  })

  it('hints when a symbol encloses 4 cells with an empty inner right', () => {
    const values: TangoValue[] = [1, 2, 0, 0, 0, 1]

    const actual = getLineNoForcingThreeInARowHint(values)

    expect(actual).toEqual({
      cellIndex: 4,
      value: 2,
    })
  })
}

export const getConsecutiveCellsHint = (
  grid: Grid<TangoValue>
): TangoHint | null => {
  for (const { cells, line } of Grid.cellsByLine(grid)) {
    const tripletMove = getLineTripletHint(cells)

    if (tripletMove) {
      return {
        position: getLineCellPosition(line, tripletMove.cellIndex),
        value: tripletMove.value,
        reason: [
          'Placing a ',
          symbol(TangoValue.NonEmpty.flip(tripletMove.value)),
          ' in this cell would give 3 in a row.',
          'Therefore, this cell must be a ',
          symbol(tripletMove.value),
          '.',
        ].join(' '),
      }
    }

    const noForcingThreeInARowMove = getLineNoForcingThreeInARowHint(cells)

    if (noForcingThreeInARowMove) {
      const incorrectValue = TangoValue.NonEmpty.flip(
        noForcingThreeInARowMove.value
      )

      return {
        position: getLineCellPosition(line, noForcingThreeInARowMove.cellIndex),
        value: noForcingThreeInARowMove.value,
        reason: [
          'Placing a ',
          symbol(incorrectValue),
          ' in this cell would force 3 ',
          symbol(noForcingThreeInARowMove.value),
          ' to be placed together.\n',
          'Therefore, this cell must be a ',
          symbol(noForcingThreeInARowMove.value),
          '.',
        ].join(' '),
      }
    }
  }

  return null
}
