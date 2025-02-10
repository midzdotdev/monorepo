import { entries } from './misc/iterable/entries'

export type Grid<TCell> = TCell[][]

export type GridPosition = {
  row: number
  col: number
}

export const eqPosition = (a: GridPosition, b: GridPosition): boolean => {
  return a.row === b.row && a.col === b.col
}

export type GridDirection = 'row' | 'col'

export interface Line {
  direction: GridDirection
  lineIndex: number
}

export const getLineCellPosition = (
  { direction, lineIndex }: Line,
  cellIndex: number
): GridPosition => {
  if (direction === 'row') {
    return { row: lineIndex, col: cellIndex }
  } else {
    return { row: cellIndex, col: lineIndex }
  }
}

export namespace Grid {
  export const clone = <TCell>(grid: Grid<TCell>): Grid<TCell> =>
    grid.map((row) => [...row])

  export const filled = <TCell>(size: number, cell: TCell): Grid<TCell> => {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(cell))
  }

  export const getSquareSize = <TCell>(grid: Grid<TCell>): number => {
    return grid.length
  }

  export const getCell = <TCell>(
    grid: Grid<TCell>,
    position: GridPosition
  ): TCell => {
    return grid[position.row][position.col]
  }

  export const setCell = <TCell>(
    grid: Grid<TCell>,
    position: GridPosition,
    cell: TCell
  ): Grid<TCell> => {
    const newGrid = grid.map((row) => [...row])

    newGrid[position.row][position.col] = cell

    return newGrid
  }

  export const getRow = <TCell>(grid: Grid<TCell>, row: number): TCell[] => {
    return grid[row]
  }

  export const getColumn = <TCell>(grid: Grid<TCell>, col: number): TCell[] => {
    return grid.map((row) => row[col])
  }

  export function* cellsByLine<TCell>(
    grid: Grid<TCell>
  ): Generator<{ cells: TCell[]; line: Line }> {
    for (const [rowIndex, cells] of entries(rows(grid))) {
      yield {
        cells,
        line: {
          direction: 'row',
          lineIndex: rowIndex,
        },
      }
    }

    for (const [colIndex, cells] of entries(columns(grid))) {
      yield {
        cells,
        line: {
          direction: 'col',
          lineIndex: colIndex,
        },
      }
    }
  }

  export function* rows<TCell>(grid: Grid<TCell>): Generator<TCell[]> {
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      yield grid[rowIndex]
    }
  }

  export function* columns<TCell>(grid: Grid<TCell>): Generator<TCell[]> {
    for (let colIndex = 0; colIndex < grid.length; colIndex++) {
      yield grid.map((row) => row[colIndex])
    }
  }

  export const mapCells = <TCell, TResult>(
    grid: Grid<TCell>,
    fn: (cell: TCell, position: GridPosition) => TResult
  ): Grid<TResult> => {
    return grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => fn(cell, { row: rowIndex, col: colIndex }))
    )
  }
}
