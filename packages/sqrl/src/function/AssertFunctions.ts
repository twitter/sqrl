/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import { SqrlFunctionRegistry } from "../function/FunctionRegistry";
import { default as AT } from "../ast/AstTypes";
import { Ast, CallAst } from "../ast/Ast";

import { AssertService, comparisonSymbols } from "sqrl-common";
import SqrlAst from "../ast/SqrlAst";

import { sqrlInvariant } from "../api/parse";
import { sqrlSourceArrow } from "../compile/sqrlSourceArrow";
import { SqrlParserState } from "../compile/SqrlParserState";
import { SqrlExecutionState } from "../execute/SqrlExecutionState";

export function registerAssertFunctions(
  registry: SqrlFunctionRegistry,
  service: AssertService
) {
  registry.save(
    function _assert(state: SqrlExecutionState, value, arrow) {
      service.ok(value, arrow);
    },
    {
      lazyArguments: true,
      allowNull: true,
      args: [AT.state, AT.any, AT.any],
      statement: true,
      statementFeature: "SqrlAssertionStatements"
    }
  );

  registry.save(
    function _assertCmp(
      state: SqrlExecutionState,
      left: any,
      operator: string,
      right: any,
      arrow: string
    ) {
      service.compare(left, operator, right, arrow);
    },
    {
      lazyArguments: true,
      allowNull: true,
      args: [AT.state, AT.any, AT.any, AT.any, AT.any],
      statement: true,
      statementFeature: "SqrlAssertionStatements"
    }
  );

  registry.save(
    function _getCurrentOutput(state, allowEmpty) {
      return state.manipulator.getCurrentHumanOutput(!!allowEmpty);
    },
    {
      args: [AT.state, AT.any]
    }
  );

  registry.save(null, {
    name: "sampleTestResults"
  });

  registry.save(null, {
    name: "assert",
    statement: true,
    transformAst(state: SqrlParserState, ast: CallAst): Ast {
      sqrlInvariant(ast, ast.args.length === 1, `Expecting a single argument`);
      let sourceArrowAst = SqrlAst.constant("");
      if (ast.location) {
        sourceArrowAst = SqrlAst.constant(
          `line ${ast.location.start.line}\n` + sqrlSourceArrow(ast.location)
        );
      }

      const [testAst] = ast.args;

      if (testAst.type === "binary_expr") {
        if (
          testAst.operator === "=" &&
          testAst.right.type === "call" &&
          testAst.right.func === "sampleTestResults"
        ) {
          const [name] = testAst.right.args;
          return SqrlAst.call("_assertSample", [
            testAst.left,
            name || SqrlAst.constant(false),
            sourceArrowAst
          ]);
        }

        if (comparisonSymbols.has(testAst.operator)) {
          return SqrlAst.call("_assertCmp", [
            testAst.left,
            SqrlAst.constant(testAst.operator),
            testAst.right,
            sourceArrowAst
          ]);
        }
      }
      return SqrlAst.call("_assert", [testAst, sourceArrowAst]);
    }
  });
}
