'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, Lightbulb } from 'lucide-react'
import { TangoGrid } from '@/components/tango/TangoGrid'
import { uniquePuzzles } from '@/lib/tango/__tests__/fixtures/puzzles/unique'
import { formatText } from '@/components/tango/utils'
import { TANGO_RULES } from '@/lib/tango/rules'
import Link from 'next/link'
import { TangoHint, getHint } from '@/lib/tango/hints'
import { AnimatePresence, motion } from 'motion/react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Kbd } from '@/components/Kbd'
import { useWindowSize } from '@uidotdev/usehooks'
import { eqGridPosition, Grid, GridPosition } from '@/lib/grid'
import { AnimatedClock } from '@/components/AnalogueClock'
import { TangoPuzzle } from '@/lib/tango/types'
import { solveTangoBruteForce } from '@/lib/tango/solve/brute-force'
import { TangoValue } from '@/lib/tango/types'
import { first } from '@/lib/std/iterable'
import { listViolations } from '@/lib/tango/violations'
import { useDebouncedViolations } from '../../../../components/tango/hooks/useDebouncedViolations'
import { isTangoGridFilled } from '@/lib/tango/check-completion'

export const runtime = 'edge'

export default function PlayTango() {
  const windowSize = useWindowSize()

  const [puzzle] = useState<TangoPuzzle>(uniquePuzzles[0])

  const [currentGrid, setCurrentGrid] = useState<Grid<TangoValue>>(puzzle.grid)

  const [moveHistory, setMoveHistory] = useState<Grid<TangoValue>[]>([
    puzzle.grid,
  ])

  const [hint, setHint] = useState<TangoHint | null>(null)

  const [seconds, setSeconds] = useState(0)

  const lockedCells = useMemo(
    () =>
      Grid.flatMap(puzzle.grid, (cell, position) =>
        cell !== 0 ? [position] : []
      ),
    [puzzle.grid]
  )

  const solution = useMemo(() => {
    return first(solveTangoBruteForce(puzzle.grid, puzzle.constraints))!
  }, [puzzle])

  const allViolations = useMemo(
    () => [...listViolations(currentGrid, puzzle.constraints)],
    [currentGrid, puzzle.constraints]
  )

  const debouncedViolations = useDebouncedViolations(allViolations)

  const isCompleted = useMemo(
    () => allViolations.length === 0 && isTangoGridFilled(currentGrid),
    [currentGrid, allViolations]
  )

  // Clear the hint once applied
  useEffect(() => {
    if (!hint) return

    if (Grid.getCellValue(currentGrid, hint.position) !== hint.value) {
      return
    }

    setHint(null)
  }, [currentGrid, hint])

  // Handle puzzle completion
  useEffect(() => {
    if (isCompleted) return

    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isCompleted])

  const onCellClick = useCallback(
    (position: GridPosition) => {
      if (lockedCells.some((x) => eqGridPosition(x, position))) return

      const cell = Grid.getCellValue(currentGrid, position)

      const newGrid = Grid.setCell(
        currentGrid,
        position,
        cell === 0 ? 1 : cell === 1 ? 2 : 0
      )

      setCurrentGrid(newGrid)
      setMoveHistory((history) => [...history, newGrid])
    },
    [currentGrid, lockedCells]
  )

  const onUndo = useCallback(() => {
    if (moveHistory.length <= 1) return

    const newHistory = moveHistory.slice(0, -1)
    const previousGrid = newHistory[newHistory.length - 1]

    setCurrentGrid(previousGrid)
    setMoveHistory(newHistory)
  }, [moveHistory])

  const onReset = useCallback(() => {
    setSeconds(0)
    setCurrentGrid(puzzle.grid)
    setMoveHistory([puzzle.grid])
  }, [puzzle.grid])

  const getCellViolations = useCallback(
    (position: GridPosition) =>
      debouncedViolations.filter((x) =>
        x.cells.some((y) => eqGridPosition(y, position))
      ),
    [debouncedViolations]
  )

  const showHint = () => {
    const hint = getHint(currentGrid, puzzle.constraints, solution)

    setHint(hint)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Tango</h1>

        <Sheet>
          <SheetTrigger>
            <HelpCircle size={20} />
          </SheetTrigger>
          <SheetContent
            side={
              windowSize.width && windowSize.height
                ? windowSize.width > windowSize.height
                  ? 'right'
                  : 'bottom'
                : 'right'
            }
          >
            <div className="max-w-sm mx-auto">
              <SheetHeader>
                <SheetTitle>How to play</SheetTitle>
                <SheetDescription>
                  Remember, every move can be made through logical deduction.
                </SheetDescription>
              </SheetHeader>

              <ul className="list-disc pl-6 gap-2 py-4">
                {Object.entries(TANGO_RULES).map(([key, value]) => (
                  <li key={key}>{formatText(value)}</li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex justify-between gap-4 items-center w-full">
        <div className="flex items-center gap-2 text-muted-foreground text-lg px-2 py-1">
          <AnimatedClock seconds={seconds} />

          <span className="font-mono font-medium">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </span>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onReset}
              variant="outline"
              disabled={moveHistory.length <= 1}
            >
              Reset
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>
              <Kbd>Shift + R</Kbd>
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <TangoGrid
        className="w-full"
        grid={currentGrid}
        constraints={puzzle.constraints}
        lockedCells={lockedCells}
        onCellClick={onCellClick}
        cellHasViolations={(pos) => getCellViolations(pos).length > 0}
        hintCell={hint?.position}
      />

      <div className="grid grid-cols-2 gap-4 justify-stretch w-full">
        <Button
          onClick={onUndo}
          variant="outline"
          disabled={moveHistory.length <= 1}
        >
          Undo
        </Button>
        <Button onClick={showHint} variant="outline" disabled={!!hint}>
          Hint
        </Button>
      </div>

      <AnimatePresence>
        {hint ? (
          <motion.div
            key="hint"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            layout
            className="w-full"
          >
            <div className="flex flex-col items-center gap-2 bg-card-foreground/10 p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Lightbulb size="1.25em" />
                <p className="font-bold">Hint</p>
              </div>

              <p>{formatText(hint.reason)}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isCompleted && (
        <div className="text-green-600 font-bold text-xl">
          Puzzle Complete! 🎉
        </div>
      )}

      <Button variant="link" asChild>
        <Link href="/design/tango">Design your own Tango puzzle</Link>
      </Button>
    </div>
  )
}
