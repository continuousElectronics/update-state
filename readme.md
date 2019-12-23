# Update State

This module returns a function that takes 2 arguments and returns a new object.

Argument 1 (previous state) -> an object that serves as your initial or previous state you want to update
Argument 2 (updater object) -> an object that describes what you want to update. Must have the same shape as previous state to update values properly.

This module will compare the shape of the updater object you supply and recursively update any key value pairs you have on the updater. If you have a function as one of the values it will replace what you have on the key instead of trying to spread it in. If you have an array as one of the values and the shape matches the previous state it will spread in the values to the array on the previous state. If you want to map, filter or reduce on the array, use a function on the key and return map, filter, or reduce. The first argument in the function you assign will be the array on the previous state. (See the Additional Use Case section)

## Install

```bash
npm install update-state
```

## Simple Use Case

```js
const updateState = require("update-state");

const prevState = {
  article: {
    title: "article title"
  }
}

const newState = updateState(prevState, {
  article: {
    title: "new article title",
    anything: {
      "else": "I want will be spread in recursively"
    }
  }
})

console.log(prevState); // prevState is NEVER mutated

console.log(newState)
// updated to ---->
// article: {
//   title: "new article title",
//   anything: {
//     "else": "I want will be spread in recursively"
//   }
// }
```

## Additional use case

```js
const updateState = require("update-state");

const prevState = {
  posts: [
    {id: 1, content: "content 1"}
  ],
  otherThings: ["thing 1", "thing 2"]
}

const newState = updateState(prevState, {
  posts: [
    // will be spread in since using array syntax
    {id: 2, content: "content 2"}
  ],
  // since using a function we can replace what was on otherThings
  // the return value of the function will replace it
  // we get the previous value in the argument of the function
  otherThings: function (otherThings) {
    return otherThings.map(
      (thing1) => thing1 + " additional ending"
    )
  }
});

console.log(prevState);
// prevState is NEVER mutated

console.log(newState)
// updated to ---->
// {
//   posts: [
//     {id: 1, content: "content 1"},
//     {id: 2, content: "content 2"}
//   ],
//   otherThings: ["thing 1 additional ending", "thing 2 additional ending"]
// }
```

## More later on usage with state management libraries

### Redux

Maybe you would only have to write one reducer for redux and the one action you dispatch updates what it needs to on the one global state object?

### React Context

Thinking about this...
