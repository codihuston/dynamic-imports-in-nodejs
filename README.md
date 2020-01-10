# Purpose
This demonstrates different ways to use the new import() in Node.js to
dynamically import modules from the filesystem.

The expected results when dynamically importing in a loop would result in
all of your specified modules being loaded; i.e.) in this example,
modules alpha and beta should be loaded.

# Use Cases
As a note, I am using `import()` in a Node.js backend, as opposed to a front-end
in the provided examples, since that is my use case.

I use some methods described here to dynamically import individual 
`.graphql` typeDef files (plain text, that do not use graphql-tools or graphql-tag) 
and join them into one cohesive schema manually.

This can be desirable for some if you like to keep your project organized in a 
"relative" structure. That is, if you wanted to keep all files relevant to each
model in a corresponding  `/Models` directory, which would
require you to find a way to break up and then import the `.graphql` files.

You can do this statically, but that can be a pain if you have many models,
which is why I decided to use the dynamic `import()` feature.

References:
- https://nodejs.org/api/esm.html
- https://javascript.info/modules-dynamic-imports

# How to Run:
`yarn run start`

# Expected Output
```
yarn run start
yarn run v1.19.1
$ babel-node index.js

ex 1 WORKS AS EXPECTED [
  { default: { name: 'alpha module' } },
  { default: { name: 'beta module' } }
]
ex 2 WORKS AS EXPECTED [
  { default: { name: 'alpha module' } },
  { default: { name: 'beta module' } }
]
ex 3 DOES NOT WORK AS EXPECTED (returns the same module in all resulting    promises!) [
  { default: { name: 'beta module' } },
  { default: { name: 'beta module' } }
]
ex 4 WORKS AS EXPECTED [
  { default: { name: 'alpha module' } },
  { default: { name: 'beta module' } }
]
promise example 1: DOES NOT WORK AS EXPECTED (returns the same module in    all resulting promises!)
 [ { name: 'beta module' }, { name: 'beta module' } ]
promise example 2: WORKS AS EXPECTED (but at the cost of specifying extra    data in the import().then() resolver)
 [ { name: 'alpha module' }, { name: 'beta module' } ]
promise example 2: WORKS AS EXPECTED
 [ { name: 'alpha module' }, { name: 'beta module' } ]

Done in 1.53s.
```