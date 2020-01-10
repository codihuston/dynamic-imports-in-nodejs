import { existsSync } from "fs";
import { join } from "path";

const dirs = ["./alpha", "./beta"];

function promiseExample1() {
  const promises = [];
  const modules = [];

  return new Promise((resolve, reject) => {
    let i = 0;
    for (let dir of dirs) {
      try {
        // warn devs if module cannot be found
        if (!existsSync(join(dir, "index.js"))) {
          console.warn("WARNING: module does not exist for: ", dir);
        } else {
          promises.push(
            import(dir).then(module => {
              return {
                module
              };
            })
          );
        }
      } catch (e) {
        console.warn("Cannot dynamically load module:", e);
      }
      i++;
    }

    // only resolve when all promises are done
    Promise.all(promises)
      .then(values => {
        for (const value of values) {
          // I cherry-pick just the default exports, but other exports will be
          // on this object
          if (value.module.default) {
            modules.push(value.module.default);
          }
        }

        resolve(modules);
      })
      .catch(e => {
        console.error(e);
      });
  });
}

function promiseExample2() {
  const promises = [];
  const modules = [];

  return new Promise((resolve, reject) => {
    let i = 0;
    for (let dir of dirs) {
      try {
        // warn devs if module cannot be found
        if (!existsSync(join(dir, "index.js"))) {
          console.warn("WARNING: module does not exist for: ", dir);
        } else {
          promises.push(
            // NOTE: import() is async; that is why this is promisified
            import(dir).then(module => {
              return {
                module,
                dir // WARNING: specifying any additional value to this return
                // object will yeild the expected dynamically imported modules
              };
            })
          );
        }
      } catch (e) {
        console.warn("Cannot dynamically load module:", e);
      }
      i++;
    }

    // only resolve when all promises are done
    Promise.all(promises)
      .then(values => {
        for (const value of values) {
          // I cherry-pick just the default exports, but other exports will be
          // on this object
          if (value.module.default) {
            modules.push(value.module.default);
          }
        }

        resolve(modules);
      })
      .catch(e => {
        console.error(e);
      });
  });
}

function promiseExample3() {
  const promises = [];
  const modules = [];

  return new Promise((resolve, reject) => {
    let i = 0;
    (async function() {
      for (let dir of dirs) {
        try {
          // warn devs if module cannot be found
          if (!existsSync(join(dir, "index.js"))) {
            console.warn("WARNING: module does not exist for: ");
          }
          // dynamically import the typeDefs and resolvers
          else {
            promises.push(
              // NOTE: import() is async; that is why this is promisified
              await import(dir).then(module => {
                return {
                  module
                };
              })
            );
          }
        } catch (e) {
          console.warn("Cannot dynamically load module:", e);
        }
        i++;
      }

      // only resolve when all promises are done
      Promise.all(promises)
        .then(values => {
          for (const value of values) {
            // I cherry-pick just the default exports, but other exports will be
            // on this object
            if (value.module.default) {
              modules.push(value.module.default);
            }
          }

          resolve(modules);
        })
        .catch(e => {
          console.error(e);
        });
    })();
  });
}

// this works
Promise.all([import(dirs[0]), import(dirs[1])]).then(res => {
  console.log("ex 1 WORKS AS EXPECTED", res);
});

// this works
const test2 = [];
test2.push(import(dirs[0]));
test2.push(import(dirs[1]));
Promise.all(test2).then(res => {
  console.log("ex 2 WORKS AS EXPECTED", res);
});

// this does not; because IMPORT() is NOT A FUNCTION; it is a special syntax
// and it CANNOT be assigned to a variable which is being done implicitly here
// in test3.push();
const test3 = [];
for (let dir of dirs) {
  test3.push(import(dir));
}
Promise.all(test3).then(res => {
  console.log(
    "ex 3 DOES NOT WORK AS EXPECTED (returns the same module in all resulting\
    promises!)",
    res
  );
});

// this does work; IMPORT() returns a promise
const test4 = [];
for (let dir of dirs) {
  test4.push(
    (async function() {
      return import(dir);
    })()
  );
}
Promise.all(test4).then(res => {
  console.log("ex 4 WORKS AS EXPECTED", res);
});

// this works
promiseExample1().then(res => {
  console.log(
    "promise example 1: DOES NOT WORK AS EXPECTED (returns the same module in\
    all resulting promises!)\n",
    res
  );
});

promiseExample2().then(res => {
  console.log(
    "promise example 2: WORKS AS EXPECTED (but at the cost of specifying extra\
    data in the import().then() resolver)\n",
    res
  );
});

promiseExample3().then(res => {
  console.log("promise example 2: WORKS AS EXPECTED\n", res);
});
