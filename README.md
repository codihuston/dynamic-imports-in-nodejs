# Notes
I am using Node version v12.14.1. This also worked in v10.

# Purpose
This demonstrates how to use the new `import()` in Node.js in  different ways to
dynamically import modules from the filesystem.

The expected results when dynamically importing in a loop would result in
all of your specified modules being loaded; i.e.) in this example,
modules alpha and beta should be loaded.

# Use Cases
When I started one of my projects, I used babel on the backend so that I could
use implement `import / export`. As a result, I am using `import()` in a 
Node.js backend, as opposed to a front-end where it is most commonly seen. You 
may find it way cleaner to simply use `require()` to import things dynamically.
I took the liberty of showing the different ways I've discovered to import
modules dynamically.

The reason I wanted to start loading modules dynamically is because of a 
`graphql` project I startred. You'll commonly hear that the `typeDefs` are in one
large file (which is apparently what facebook does).

This can be undesirable for some if you like to keep your project organized in a 
"relative" structure. That is, if you wanted to keep all files relevant to each
model in a corresponding  `/Models` directory, which would
require you to find a way to break up the `graphql schema`. If you are using
`.graphql` files (plain text) instead of `graphql-tag` or `graphql-tools` to 
build your schema in `template strings`, then you would then have
to either:

1. Import each `.graphql` schema statically and join them into one string before
   passing it to the `graphql server` prior to initialization
2. Import each `.graphql` schema `dynampically`, and join them the same way

You can do this statically, but that can be a pain if you have many models,
which is why I decided to look into using the dynamic `import()` feature and
`require()`, the former of which is the easiest, cleanest way to do it.

References:
- https://nodejs.org/api/esm.html
- https://javascript.info/modules-dynamic-imports

# How to Run:
`yarn run start`

# Expected Output
```
arn run v1.19.1
$ babel-node index.js
require example 1: WORKS AS EXPECTED
 [
  { default: { name: 'alpha module' } },
  { default: { name: 'beta module' } }
]
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
promise example 3: WORKS AS EXPECTED
 [ { name: 'alpha module' }, { name: 'beta module' } ]
Done in 1.56s.
```