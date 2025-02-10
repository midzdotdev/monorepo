'use client'

import { CSSProperties } from 'react'
import { Moon, SquareEqual, SquareX, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TangoValue, TangoConstraint } from '../types'
import { eqPosition, Grid, GridPosition } from '@/lib/Grid'
import { TangoHint } from '../hints'

interface TangoGridProps {
  grid: Grid<TangoValue>
  constraints: TangoConstraint[]
  lockedCells: GridPosition[]
  onCellClick: (position: GridPosition) => void
  cellHasViolations: (position: GridPosition) => boolean
  isDesignMode?: boolean
  constraintStartCell?: GridPosition | null
  hint?: TangoHint | null
}

export function TangoGrid({
  grid,
  constraints,
  lockedCells,
  onCellClick,
  cellHasViolations,
  isDesignMode = false,
  constraintStartCell = null,
  hint,
}: TangoGridProps) {
  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => {
              const position = { row: rowIndex, col: colIndex }

              const isLocked = lockedCells.some((x) => eqPosition(x, position))

              const hasViolation = cellHasViolations(position)

              const isConstraintStartCell = constraintStartCell
                ? eqPosition(constraintStartCell, position)
                : false

              const isHighlighted = hint
                ? eqPosition(hint.position, position)
                : false

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    `w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors`,
                    cell === 0 ? 'border-border' : '',
                    cell === 1 &&
                      !hasViolation &&
                      'border-yellow-400 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/15',
                    cell === 2 &&
                      !hasViolation &&
                      'border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15',
                    hasViolation &&
                      'border-destructive text-destructive hover:bg-destructive/10',
                    isLocked && 'opacity-70 cursor-not-allowed',
                    isConstraintStartCell && 'ring-2 ring-green-500',
                    isHighlighted && 'ring-2 ring-blue-500 animate-pulse',
                    isDesignMode && 'cursor-pointer hover:bg-accent/20'
                  )}
                  onClick={() => onCellClick(position)}
                  disabled={isLocked}
                >
                  {cell === 1 && (
                    <Sun className="w-6 h-6" fill="currentColor" size="1em" />
                  )}
                  {cell === 2 && (
                    <Moon className="w-6 h-6" fill="currentColor" size="1em" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {constraints.map((constraint, index) => {
        const CELL_SIZE = 48 // 3rem (w-12)
        const CELL_GAP = 8 // 0.5rem (gap-2)

        const x = constraint.col * (CELL_SIZE + CELL_GAP)
        const y = constraint.row * (CELL_SIZE + CELL_GAP)

        const style: CSSProperties = {
          position: 'absolute',
          left:
            constraint.direction === 'row'
              ? x + CELL_SIZE + CELL_GAP / 2 // Center between cells horizontally
              : x + CELL_SIZE / 2, // Center on cell
          top:
            constraint.direction === 'col'
              ? y + CELL_SIZE + CELL_GAP / 2 // Center between cells vertically
              : y + CELL_SIZE / 2, // Center on cell
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
        }

        return (
          <div
            key={index}
            style={style}
            className="text-gray-500 pointer-events-none"
          >
            {constraint.type === 'equal' && <SquareEqual fill="white" />}
            {constraint.type === 'opposite' && <SquareX fill="white" />}
          </div>
        )
      })}
    </div>
  )
}
