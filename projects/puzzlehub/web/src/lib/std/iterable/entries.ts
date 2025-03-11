export function* entries<T>(iterable: Iterable<T>): Generator<[number, T]> {
  let i = 0

  for (const value of iterable) {
    yield [i++, value]
  }
}
