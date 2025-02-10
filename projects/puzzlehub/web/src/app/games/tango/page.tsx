'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SquareEqual, SquareX, Sun, Moon, Lightbulb } from 'lucide-react'
import { useTango } from './hooks/useTango'
import { TangoGrid } from './components/TangoGrid'
import { PUZZLES } from './puzzles'
import { symbol } from './utils'

export const formatText = (text: string) => {
  const parts = text.split(/({sun}|{moon}|{equal}|{opposite})/g)

  return (
    <>
      {parts.map((part, i) => {
        switch (part) {
          case '{sun}':
            return (
              <Sun
                key={i}
                className="inline text-yellow-500 align-text-top"
                fill="currentColor"
                size="1.25em"
              />
            )
          case '{moon}':
            return (
              <Moon
                key={i}
                className="inline text-blue-500 align-text-top"
                fill="currentColor"
                size="1.25em"
              />
            )
          case '{equal}':
            return (
              <SquareEqual
                key={i}
                className="inline text-gray-500 align-text-top"
                size="1.25em"
                fill="white"
              />
            )
          case '{opposite}':
            return (
              <SquareX
                key={i}
                className="inline text-gray-500 align-text-top"
                size="1.25em"
                fill="white"
              />
            )
          default:
            return part
        }
      })}
    </>
  )
}

export default function TangoGame() {
  const [currentPuzzleId, setCurrentPuzzleId] = useState<number>(1)

  const tango = useTango()

  useEffect(() => {
    const puzzle = PUZZLES.find((p) => p.id === currentPuzzleId)
    if (!puzzle) return

    tango.set(puzzle.grid, puzzle.constraints)
  }, [currentPuzzleId])

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Tango</h1>
        <Link href="/games/tango/design">
          <Button variant="outline">Create Puzzle</Button>
        </Link>
      </div>

      <TangoGrid
        grid={tango.grid}
        constraints={tango.constraints}
        lockedCells={tango.lockedCells}
        onCellClick={tango.toggleCell}
        cellHasViolations={tango.cellHasViolations}
        hint={tango.hint}
      />

      {tango.hint && (
        <div className="flex flex-col items-center gap-2 bg-card-foreground/10 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <Lightbulb size="1.25em" />
            <p className="font-bold">Hint</p>
          </div>

          <p className="font-bold">{formatText(tango.hint.reason)}</p>
          <p className="text-sm text-gray-500">
            {formatText(`The cell must be a ${symbol(tango.hint.value)}`)}
          </p>
        </div>
      )}

      {tango.isCompleted && (
        <div className="text-green-600 font-bold text-xl">
          Puzzle Complete! 🎉
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h2 className="text-xl font-semibold">Rules:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>{formatText('Fill the grid with {sun} and {moon}')}</li>
          <li>
            {formatText(
              'No more than 2 {sun} or {moon} may be next to each other horizontally or vertically'
            )}
          </li>
          <li>
            {formatText(
              'Each row and column must have an equal number of {sun} and {moon}'
            )}
          </li>
          <li>
            {formatText('Cells with {equal} between them must be the same')}
          </li>
          <li>
            {formatText('Cells with {opposite} between them must be different')}
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => tango.reset()}
          variant="outline"
          disabled={!tango.canUndo}
        >
          Reset Puzzle
        </Button>
        <Button
          onClick={tango.undo}
          variant="outline"
          disabled={!tango.canUndo}
        >
          Undo Move
        </Button>
        <Button
          onClick={() => tango.hint && tango.toggleCell(tango.hint.position)}
          variant="outline"
          disabled={!tango.hint}
        >
          Hint
        </Button>
        <Button onClick={tango.autosolve} variant="outline">
          Autosolve
        </Button>
      </div>
    </div>
  )
}
