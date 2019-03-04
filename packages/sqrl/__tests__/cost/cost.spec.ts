import { runSqrlTest } from "../../src";
import { performance } from "perf_hooks";

/**
 * Copyright 2019 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */

test("works", async () => {
  let aTime = null;
  let bTime = null;
  async function register(instance) {
    instance.registerSync(function a(rv) {
      aTime = performance.now();
      return rv;
    });
    instance.registerSync(function b(rv) {
      bTime = performance.now();
      return rv;
    });
  }

  const statements = [
    "ASSERT (a(false) OR b(false)) = false;",
    "ASSERT (a(true) AND b(true)) = true;",
    "LET A := a(false); LET B := b(false); ASSERT (A or B)  = false;",
    "LET A := a(true);  LET B := b(true);  ASSERT (A AND B) = true;"
  ];

  for (const statement of statements) {
    // A is mentioned first in all the statements so when everything else is equal- should be first.
    aTime = null;
    bTime = null;
    await runSqrlTest(statement, { register });
    expect(aTime).toBeLessThan(bTime);

    aTime = null;
    bTime = null;
    await runSqrlTest(statement, {
      register,
      functionCost: {
        a: 1000,
        b: 1
      }
    });
    expect(aTime).toBeGreaterThan(bTime);

    aTime = null;
    bTime = null;
    await runSqrlTest(statement, {
      register,
      functionCost: {
        a: 1,
        b: 1000
      }
    });
    expect(aTime).toBeLessThan(bTime);
  }
});
