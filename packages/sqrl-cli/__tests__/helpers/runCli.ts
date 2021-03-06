/**
 * Copyright 2019 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import { Writable, Readable } from "stream";
import { invariant } from "sqrl-common";
import { cliMain, CliMainOptions } from "../../src/cli/CliMain";
import { CloseableGroup } from "../../src/jslib/Closeable";
import { parseArgs } from "../../src/cli/CliArgs";

class StringBuffer extends Writable {
  public string: string = "";
  _write(chunk: Buffer, enc, cb) {
    invariant(chunk instanceof Buffer, "expected buffer writes");
    this.string += chunk.toString("utf-8");
    cb();
  }
}

export async function runCli(
  argv: string[],
  stdinString?: string,
  options: CliMainOptions = {}
) {
  const closeables = new CloseableGroup();
  const stdin = new Readable();
  stdin.push(stdinString);
  stdin.push(null);
  const stdout = new StringBuffer();

  const args = parseArgs(argv);
  try {
    await cliMain(args, closeables, {
      ...options,
      stdin,
      stdout,
    });
  } finally {
    closeables.close();
  }

  return stdout.string;
}
