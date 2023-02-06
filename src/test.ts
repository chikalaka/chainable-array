import _A, { ChainableArray } from "./index"

const passIfSame = <T>(a1: ChainableArray<T>, a2: Array<T>) => {
  expect(a1.toArray()).toEqual(a2)
}

const func = () => "hello function"
const first6 = [1, 2, 3, NaN, 0, ""]
const last6 = ["a", 9, undefined, null, { aaa: "aaa" }, func]
const arr = [...first6, 7, [12, 13], false, 9, true, 9, ...last6]

test("Many chainable methods", () => {
  const expected = [1, 2, 3, 12, 13, 9, true, "a", { aaa: "aaa" }, func]

  const result = _A(arr)
    .first(30)
    .slice()
    .last(30)
    .map(x => x)
    .removeFalsy()
    .concat()
    .flatMap(v => [v])
    .filter(v => true)
    .flat()
    .reverse()
    .reverse()
    .unique()
    .remove(7)

  passIfSame(result, expected)
})

test("Pass one or zero values to _A", () => {
  passIfSame(_A([4]), [4])
  passIfSame(_A([]), [])
})

test("first", () => {
  let result = _A(arr).first(6)
  passIfSame(result, first6)
  result = result.first(6)
  passIfSame(result, first6)
  result = result.first(2)
  passIfSame(result, [1, 2])
  result = result.first()
  passIfSame(result, [1])
  result = result.first(2)
  passIfSame(result, [1])
  result = result.first(1)
  passIfSame(result, [1])
})

test("last", () => {
  let result = _A(arr).last(60)
  passIfSame(result, arr)
  result = result.last(6)
  passIfSame(result, last6)
  result = result.last(6)
  passIfSame(result, last6)
  result = result.last(2)
  passIfSame(result, [{ aaa: "aaa" }, func])
  result = result.last()
  passIfSame(result, [func])
  result = result.last(2)
  passIfSame(result, [func])
  result = result.last(1)
  passIfSame(result, [func])
})

test("unique", () => {
  const objects = [{ a: 2 }, { a: 2 }, [], [], {}, {}]
  const numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3]
  const strings = ["1", "2", "3", "1", "2", "3", "1", "2", "3"]

  const expected = [...objects, 1, 2, 3, "1", "2", "3", func]
  let result = _A([...objects, ...numbers, ...strings, func, func]).unique()
  passIfSame(result, expected)
  result = result.unique().unique().unique()
  passIfSame(result, expected)
})

test("removeFalsy", () => {
  let result = _A(arr).removeFalsy()
  const expected = [
    1,
    2,
    3,
    7,
    [12, 13],
    9,
    true,
    9,
    "a",
    9,
    { aaa: "aaa" },
    func
  ]
  passIfSame(result, expected)
  result = result.removeFalsy().removeFalsy().removeFalsy()
  passIfSame(result, expected)
})

test("remove", () => {
  let result = _A([1, 1.2, "3", true, false, { aaa: { bbb: "bbb" } }])
  result = result.remove(1.2)
  passIfSame(result, [1, "3", true, false, { aaa: { bbb: "bbb" } }])
  result = result.remove(7).remove(7).remove(7)
  passIfSame(result, [1, "3", true, false, { aaa: { bbb: "bbb" } }])
  result = result.remove(3)
  passIfSame(result, [1, "3", true, false, { aaa: { bbb: "bbb" } }])
  result = result.remove("3")
  passIfSame(result, [1, true, false, { aaa: { bbb: "bbb" } }])
  result = result.remove(o => o?.aaa?.bbb === "bbb")
  passIfSame(result, [1, true, false])
  passIfSame(
    result.remove(o => o !== 1),
    [1]
  )
  passIfSame(
    result.remove((_, i) => i !== 1),
    [true]
  )
})

const users = [
  { user: { name: "fred" }, age: 48 },
  { user: { name: "barney" }, age: 34 },
  { user: { name: "fred" }, age: 40 },
  { user: { name: "claire" }, age: 40, val: 2, test: 1 },
  { user: { name: "claire" }, age: 40, val: 1 },
  { user: { name: "claire" }, age: 40, val: 2 },
  { user: { name: "barney" }, age: 31 }
]

test("orderBy", () => {
  let expected = [
    { user: { name: "barney" }, age: 34 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "fred" }, age: 48 },
    { user: { name: "fred" }, age: 40 }
  ]
  let result = _A(users).orderBy(
    (o: any) => o.user.name,
    ["age", "desc"],
    "val"
  )
  passIfSame(result, expected)

  expected = [
    { user: { name: "fred" }, age: 48 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "barney" }, age: 31 }
  ]
  result = _A(users).orderBy("someUnknownKey", ["age", "desc"], "val")
  passIfSame(result, expected)

  expected = [
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 }
  ]
  result = _A(users).orderBy("val")
  passIfSame(result, expected)

  expected = [
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "barney" }, age: 31 }
  ]
  result = _A(users).orderBy(["val", "desc"])
  passIfSame(result, expected)

  expected = [
    { user: { name: "fred" }, age: 48 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "barney" }, age: 31 }
  ]
  result = _A(users).orderBy(
    [(o: any) => o.user.name, "desc"],
    ["age", "desc"],
    ["val", "asc"],
    "unknown",
    ["unknown", "desc"],
    "unknown"
  )
  passIfSame(result, expected)

  const users2 = [
    { user: { name: "Alice" }, age: 20, val: 1 },
    { user: { name: "Bob" }, age: 40, val: 4 },
    { user: { name: "Alice" }, age: 30, val: 2 },
    { user: { name: "Bob" }, age: 40, val: 3 }
  ]

  const ordered = _A(users2).orderBy(o => o.user.name, ["age", "desc"], "val")

  const orderedExpected = [
    { user: { name: "Alice" }, age: 30, val: 2 },
    { user: { name: "Alice" }, age: 20, val: 1 },
    { user: { name: "Bob" }, age: 40, val: 3 },
    { user: { name: "Bob" }, age: 40, val: 4 }
  ]

  passIfSame(ordered, orderedExpected)
})

test("sortBy", () => {
  let expected = [
    { user: { name: "barney" }, age: 34 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "fred" }, age: 48 },
    { user: { name: "fred" }, age: 40 }
  ]
  let result = _A(users).sortBy((o: any) => o.user.name, "asc")
  passIfSame(result, expected)
  result = _A(users).sortBy((o: any) => o.user.name)
  passIfSame(result, expected)

  result = _A(users).sortBy("someUnknownKey", "desc")
  passIfSame(result, users)

  expected = [
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "barney" }, age: 31 }
  ]

  result = _A(users).sortBy("test", "desc")
  passIfSame(result, expected)

  expected = [
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 }
  ]
  result = _A(users).sortBy("test", "asc")
  passIfSame(result, expected)

  expected = [
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "barney" }, age: 31 }
  ]
  result = _A(users).sortBy("val", "desc")
  passIfSame(result, expected)

  expected = [
    { user: { name: "fred" }, age: 48 },
    { user: { name: "barney" }, age: 34 },
    { user: { name: "fred" }, age: 40 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 1 },
    { user: { name: "claire" }, age: 40, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 }
  ]
  result = _A(users).sortBy("val")
  passIfSame(result, expected)

  const values = [
    { user: { name: "fred" }, age: 0 },
    { user: { name: "barney" }, age: -2 },
    { user: { name: "fred" }, age: 10 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 0, val: 1 },
    { user: { name: "claire" }, age: -4, val: 2, test: 1 },
    { user: { name: "claire" }, age: 40, val: 2 }
  ]
  expected = [
    { user: { name: "claire" }, age: -4, val: 2, test: 1 },
    { user: { name: "barney" }, age: -2 },
    { user: { name: "fred" }, age: 0 },
    { user: { name: "claire" }, age: 0, val: 1 },
    { user: { name: "fred" }, age: 10 },
    { user: { name: "barney" }, age: 31 },
    { user: { name: "claire" }, age: 40, val: 2 }
  ]
  result = _A(values).sortBy("age")
  passIfSame(result, expected)
})

test("toArray", () => {
  const chainableArray = new ChainableArray([1, 2, 3])
  const array = chainableArray.toArray()

  expect(array instanceof Array).toBe(true)
  expect(array instanceof ChainableArray).toBe(false)
})
