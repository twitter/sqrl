/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import { StdlibRegistry } from "./FunctionRegistry";
import * as util from "util";
import { SqrlExecutionState } from "../execute/SqrlExecutionState";
import { LogService } from "../api/execute";

export function registerLogFunctions(
  registry: StdlibRegistry,
  service: LogService = null
) {
  registry.save(
    function log(state: SqrlExecutionState, format: string, ...args) {
      const message = util.format(format, ...args);
      if (service) {
        service.log(state.manipulator, message);
      } else {
        state.info({}, "[from sqrl] %s", message);
      }
    },
    {
      allowNull: true,
      statement: true,
      statementFeature: "SqrlLogStatements",
      stateArg: true,
      argstring: "format string, value...",
      docstring: "Logs a message using sprintf style formatting"
    }
  );
}
