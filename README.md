# [chainable-array](https://www.npmjs.com/package/chainable-array) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chikalaka/chainable-array/blob/main/LICENSE)

A function that extends `Array` with chainable array methods.

More functionality to the "simple" `Array`, but **only** with chainable methods.
Don't expect for functions which are not chainable, i.e. methods which won't return an array.



## Installation
```shell
npm install chainable-array
```

## Usage
```js
import _A from 'chainable-array';

const arr = [1, null, 2, 2, 3];
_A(arr)
  .first(4) // [1, null, 2, 2]
  .last(3) // [null, 2, 2]
  .removeFalsy() // [2, 2]
  .unique() // [2]
```

## API
****All the APIs returns a new array**

- [constructor](#constructor)
- [first](#first)
- [last](#last)
- [log](#log)
- [orderBy](#orderby)
- [remove](#remove)
- [removeFalsy](#removefalsy)
- [sortBy](#sortby)
- [toArray](#toarray)
- [unique](#unique)

### constructor
The `ChainableArray` constructor is a bit different than the `Array` constructor.
If you pass only one argument, it won't define the size of the array, but it will create an array with one value.
```js
import { ChainableArray } from 'chainable-array';

const arr = new ChainableArray(5) // [5]
```

### first
Returns the `first` n (defaults to 1) elements
```js
import _A from 'chainable-array';

_A([1, 2, 3]).first(2) // [1, 2]
```

### last
Returns the `last` n (defaults to 1) elements
```js
import _A from 'chainable-array';

_A([1, 2, 3]).last(2) // [2, 3]
```

### log
Simple, console.log for debugging
```js
import _A from 'chainable-array';

_A([1, 2, 3]).log() // [ 1, 2, 3 ]
```

### orderBy
Sequence of `sortBy` for array of objects, in order to get "nested" sorting

Args: list of: `string | o => any`, `"asc" | "desc"` (defaults to `"asc"`) 
```js
import _A from 'chainable-array';

const users = [
  { user: { name: "Alice" }, age: 20, val: 1 },
  { user: { name: "Bob" }, age: 40, val: 4 },
  { user: { name: "Alice" }, age: 30, val: 2 },
  { user: { name: "Bob" }, age: 40, val: 3 },
]

const ordered = _A(users).orderBy(
  o => o.user.name,
  ["age", "desc"],
  "val"
)

const expected = [
  { user: { name: "Alice" }, age: 30, val: 2 },
  { user: { name: "Alice" }, age: 20, val: 1 },
  { user: { name: "Bob" }, age: 40, val: 3 },
  { user: { name: "Bob" }, age: 40, val: 4 }
]

// ordered == expected
```

### remove
Remove elements from the array

Args: `Primitive | ((value, index, array) => boolean)`
```js
import _A from 'chainable-array';

_A([1, 2, 3])
  .remove(2) // [1, 3]
  .remove(v => v > 2) // [1]
```

### removeFalsy
Remove falsy values from the array

```js
import _A from 'chainable-array';

_A([1, 2, 3, null, undefined, 0, ""])
  .removeFalsy() // [1, 2, 3]
```

### sortBy
`sort` for array of objects

Args: `string | o => any`, `"asc" | "desc"` (defaults to `"asc"`)
```js
import _A from 'chainable-array';

const users = [
  { user: { name: "Alice" }, age: 20, val: 1 },
  { user: { name: "Bob" }, age: 40, val: 4 },
  { user: { name: "Alice" }, age: 30, val: 2 },
  { user: { name: "Bob" }, age: 40, val: 3 },
]

const ordered = _A(users).sortBy(o => o.user.name, "desc")

const expected = [
  { user: { name: "Bob" }, age: 40, val: 4 },
  { user: { name: "Bob" }, age: 40, val: 3 },
  { user: { name: "Alice" }, age: 20, val: 1 },
  { user: { name: "Alice" }, age: 30, val: 2 }
]

// ordered == expected
```

### toArray
Returns `Array` using the `Array.from` method

```js
import _A from 'chainable-array';

_A([1, 2, 3]) // instanceof ChainableArray
_A([1, 2, 3]).toArray() // NOT instanceof ChainableArray
```

### unique
Returns unique values from the array

```js
import _A from 'chainable-array';

_A([1, 2, 1, 3, 2]) // [1, 2, 3]
```
