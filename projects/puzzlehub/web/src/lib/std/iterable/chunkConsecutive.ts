export const chunkConsecutive = <T>(
  array: T[],
  eq: (a: T, b: T) => boolean
): T[][] =>
  array.reduce<T[][]>((chunks, item) => {
    const lastChunk = chunks.at(-1)
    const lastItem = lastChunk?.at(-1)

    if (!lastChunk) {
      return [[item]]
    }

    if (lastItem && eq(lastItem, item)) {
      return [...chunks.slice(0, -1), [...lastChunk, item]]
    }

    chunks.push([item])
    return chunks
  }, [])

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should return an empty array if the input array is empty', () => {
    const result = chunkConsecutive([], (a, b) => a === b)

    expect(result).toEqual([])
  })

  it('should return an array with a single item if the input array has a single item', () => {
    const result = chunkConsecutive([1], (a, b) => a === b)

    expect(result).toEqual([[1]])
  })

  it('should chunk consecutive items', () => {
    const result = chunkConsecutive(
      [1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
      (a, b) => a === b
    )

    expect(result).toEqual([[1], [2, 2], [3, 3, 3], [4, 4, 4, 4]])
  })

  it('uses the provided equality function', () => {
    const items = [1, 2, 3, 4].map((value) => ({ value }))

    const result = chunkConsecutive(items, (a, b) => a.value === b.value)

    expect(result).toEqual([
      [{ value: 1 }],
      [{ value: 2 }],
      [{ value: 3 }],
      [{ value: 4 }],
    ])
  })
}
