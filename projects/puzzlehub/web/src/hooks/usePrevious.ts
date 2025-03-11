import { useState } from 'react'

export const usePrevious = <T>(
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
