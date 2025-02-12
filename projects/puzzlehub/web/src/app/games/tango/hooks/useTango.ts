'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { TangoValue, TangoConstraint } from '../types'
import { eqPosition, Grid, GridPosition } from '@/lib/Grid'
import { makeEmptyGrid } from '../utils'
import { checkGridPlayProgress } from '../checks'
import { useDebounce } from '@uidotdev/usehooks'
import { useInterval } from 'usehooks-ts'
import { getHint } from '../hints'

const EMPTY_GRID = makeEmptyGrid(6)

const VIOLATIONS_DEBOUNCE_MS = 1000

export function useTango() {
  const [initialGrid, setInitialGrid] = useState<Grid<TangoValue>>(EMPTY_GRID)

  const lockedCells = useMemo(() => {
    return initialGrid.flatMap((row, rowIndex) =>
      row.flatMap((cell, colIndex) =>
        cell !== 0 ? { row: rowIndex, col: colIndex } : []
      )
    )
  }, [initialGrid])

  const [grid, setGrid] = useState<Grid<TangoValue>>(initialGrid)

  const [moveHistory, setMoveHistory] = useState<Grid<TangoValue>[]>([
    initialGrid,
  ])

  const [constraints, setConstraints] = useState<TangoConstraint[]>([])

  const [isAutosolving, setIsAutosolving] = useState(false)

  const toggleCell = useCallback(
    (position: GridPosition) => {
      if (lockedCells.some((x) => eqPosition(x, position))) return

      const cell = Grid.getCell(grid, position)

      const newGrid = Grid.setCell(
        grid,
        position,
        cell === 0 ? 1 : cell === 1 ? 2 : 0
      )

      setGrid(newGrid)
      setMoveHistory((history) => [...history, newGrid])
    },
    [grid, lockedCells]
  )

  const canUndo = useMemo(() => moveHistory.length > 1, [moveHistory])

  const undo = useCallback(() => {
    if (moveHistory.length <= 1) return

    const newHistory = moveHistory.slice(0, -1)
    const previousGrid = newHistory[newHistory.length - 1]

    setGrid(previousGrid)
    setMoveHistory(newHistory)
  }, [moveHistory])

  const addConstraint = useCallback((constraint: TangoConstraint) => {
    setConstraints((prev) => [...prev, constraint])
  }, [])

  const set = useCallback(
    (newGrid: Grid<TangoValue>, newConstraints: TangoConstraint[]) => {
      setGrid(newGrid)
      setInitialGrid(newGrid)
      setMoveHistory([newGrid])
      setConstraints(newConstraints)
    },
    []
  )

  const reset = useCallback(() => {
    setGrid(initialGrid)
    setMoveHistory([initialGrid])
  }, [initialGrid])

  const playProgress = useMemo(
    () => checkGridPlayProgress(grid, constraints),
    [grid, constraints]
  )

  const debouncedViolations = useDebouncedViolations(
    playProgress.cellViolations
  )

  const cellHasViolations = useCallback(
    (position: GridPosition): boolean =>
      debouncedViolations.some((x) => eqPosition(x, position)),
    [debouncedViolations]
  )

  const hint = useMemo(() => getHint(grid, constraints), [grid, constraints])

  const isCompleted = useMemo(() => playProgress.isCompleted, [playProgress])

  useEffect(() => {
    if (isCompleted) {
      setIsAutosolving(false)
    }
  }, [isCompleted])

  const autosolve = useCallback(() => {
    if (isAutosolving) return

    setIsAutosolving(true)
  }, [isAutosolving])

  useInterval(
    () => {
      if (!hint) {
        setIsAutosolving(false)
        return
      }

      const newGrid = Grid.setCell(grid, hint.position, hint.value)

      setGrid(newGrid)
      setMoveHistory((history) => [...history, newGrid])
    },
    isAutosolving ? 1000 : null
  )

  return {
    grid,
    constraints,
    isCompleted,
    hint,
    toggleCell,
    canUndo,
    lockedCells,
    isAutosolving,
    undo,
    addConstraint,
    set,
    reset,
    cellHasViolations,
    autosolve,
  }
}

export const useDebouncedViolations = (violations: GridPosition[]) => {
  const debouncedViolations = useDebounce(violations, VIOLATIONS_DEBOUNCE_MS)

  const previousViolations = usePreviousEq(
    violations,
    (a, b) => a !== null && a.length === b.length
  )

  if (!previousViolations) return violations

  const hasSatisfiedViolation = violations.length < previousViolations.length

  return hasSatisfiedViolation ? violations : debouncedViolations
}

export const usePreviousEq = <T>(
  value: T,
  eq: (prev: T | null, next: T) => boolean
): T | null => {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState<T | null>(null)

  if (!eq(current, value)) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}
