type Primitive = boolean | string | number | bigint | null | undefined

type Order = "asc" | "desc"
type KeyAndOrder = [KeyOrFunc, Order]
type KeyOrFunc = ((o: Dictionary) => any) | string
type SortByNumber = -1 | 1 | 0
type Nullish = null | undefined

const isNullish = (v: unknown): v is Nullish => v === undefined || v === null
const isFunction = (v: unknown): v is Function => typeof v === "function"

type Dictionary<Value = any> = {
  [key: PropertyKey]: Value
}

type Remove<T> = (
  value:
    | Primitive
    | ((value: T, index: number, array: ChainableArray<T>) => boolean)
) => ChainableArray<T>
type Concat<T> = (...items: (T[] | ConcatArray<T>)[]) => ChainableArray<T>
type Filter<T> = (
  predicate: (value: T, index: number, array: ChainableArray<T>) => unknown
) => ChainableArray<T>
type FlatMap<T> = <U>(
  callback: (value: T, index: number, array: ChainableArray<T>) => U
) => ChainableArray<U>
type Map<T> = <U>(
  callback: (value: T, index: number, array: T[]) => U
) => ChainableArray<U>

class ChainableArray<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items)
    if (items.length === 1) {
      this.length = 0
      this.push(items[0])
    }
  }

  // Array chainable methods
  concat: Concat<T> = (...items) => _A(super.concat(...items))
  // @ts-ignore
  filter: Filter<T> = predicate => _A(super.filter(predicate))
  flat = (depth = 1) => _A(super.flat(depth))
  // @ts-ignore
  flatMap: FlatMap<T> = callback => _A(super.flatMap(callback))
  map: Map<T> = callback => _A(super.map(callback))
  reverse = () => _A(super.reverse())
  slice = (start?: number, end?: number) => _A(super.slice(start, end))
  sort = (compareFn?: (a: T, b: T) => number): this => super.sort(compareFn)

  // Extended Chainable methods
  log = () => {
    console.log(`[ ${super.join(", ")} ]`)
    return this
  }
  first = (n: number = 1) => _A(super.slice(0, n))
  last = (n = 1) => (n < this.length ? _A(super.slice(this.length - n)) : this)
  unique = () => _A(Array.from(new Set(this)))
  removeFalsy = () => _A(super.filter(v => v))
  remove: Remove<T> = val =>
    // @ts-ignore
    _A(super.filter((v, i, a) => (isFunction(val) ? !val(v, i, a) : v !== val)))
  orderBy = (...keys: (KeyOrFunc | KeyAndOrder)[]) =>
    // @ts-ignore
    _A(super.sort(orderBy(keys.reverse())))
  // @ts-ignore
  sortBy = (key: KeyOrFunc, order?: Order) => _A(super.sort(sortBy(key, order)))
  toArray = () => Array.from(this)
}

const sortBy =
  (key: KeyOrFunc, order?: Order) =>
  (a: Dictionary, b: Dictionary): SortByNumber => {
    const aVal = isFunction(key) ? key(a) : a[key]
    const bVal = isFunction(key) ? key(b) : b[key]

    if (aVal < bVal) return order === "desc" ? 1 : -1
    if (aVal > bVal) return order === "desc" ? -1 : 1

    if ([aVal, bVal].every(isNullish)) return 0

    if (isNullish(aVal)) return order === "desc" ? 1 : -1
    if (isNullish(bVal)) return order === "desc" ? -1 : 1

    return 0
  }

const orderBy =
  (keys: (KeyOrFunc | KeyAndOrder)[]) =>
  (a: Dictionary, b: Dictionary): SortByNumber => {
    let result: SortByNumber = 0
    keys.forEach(key => {
      const [sortKey, order] = Array.isArray(key) ? key : [key]

      const sortByNumber = sortBy(sortKey, order)(a, b)
      if (sortByNumber) result = sortByNumber
    })

    return result
  }

const _A = (arr: any[]) => new ChainableArray(...arr)

export { ChainableArray }

export default _A
