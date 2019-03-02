/**
 * Copyright 2019 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import { register as registerTextFunctions } from "../../src";
import { register as registerLoadFunctions } from "sqrl-load-functions";

import { buildTestFunctionRegistry, runSqrlTest, Filesystem } from "sqrl";

interface Options {
  filesystem?: Filesystem;
}

export async function runTextSqrlTest(sqrl: string, options: Options) {
  const functionRegistry = await buildTestFunctionRegistry();

  return runSqrlTest(sqrl, {
    functionRegistry,
    register: async instance => {
      await registerLoadFunctions(instance);
      await registerTextFunctions(instance);
    },
    ...options
  });
}

export function textSqrlTest(
  description: string,
  sqrl: string,
  options: Options = {}
) {
  test(description, () => runTextSqrlTest(sqrl, options));
}
