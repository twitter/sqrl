/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import { SqrlFunctionRegistry } from "./FunctionRegistry";
import { Ast } from "../ast/Ast";

import { AstTypes as AT } from "../ast/AstTypes";
import SqrlAst from "../ast/SqrlAst";
import { SqrlObject } from "../object/SqrlObject";

import invariant from "../jslib/invariant";
import jsonpath = require("jsonpath");
import { SqrlParserState } from "../compile/SqrlParserState";
import { sqrlInvariant } from "../api/parse";

// $[ (digits / single quoted string / double quoted string) ] (anything)
const JSON_BRAKET_REGEX = /^\$\[([0-9]+|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\](.*)$/;

export function registerDataFunctions(registry: SqrlFunctionRegistry) {
  registry.save(
    function attr(data: any, key: string | number): any {
      if (data instanceof SqrlObject) {
        data = data.getBasicValue();
      }
      key = SqrlObject.ensureBasic(key);
      if (
        data === null ||
        typeof data !== "object" ||
        (typeof key !== "string" && typeof key !== "number") ||
        !data.hasOwnProperty(key)
      ) {
        return null;
      } else {
        return data[key];
      }
    },
    {
      allowNull: true,
      allowSqrlObjects: true,
      argCount: 2
    }
  );

  registry.save(
    function hasAttr(data, key) {
      if (
        data === null ||
        typeof data !== "object" ||
        (typeof key !== "string" && typeof key !== "number")
      ) {
        return null;
      }
      return data.hasOwnProperty(key);
    },
    {
      allowNull: true,
      argCount: 2
    }
  );

  registry.save(
    function keys(data) {
      if (data === null || typeof data !== "object") {
        return null;
      } else {
        return Object.keys(data);
      }
    },
    {
      argCount: 1
    }
  );

  registry.save(
    function jsonParse(raw: string) {
      return JSON.parse(raw);
    },
    {
      args: [AT.any.string]
    }
  );

  registry.save(null, {
    name: "jsonValue",
    args: [AT.any, AT.constant.string],
    transformAst(state: SqrlParserState, ast): Ast {
      const pathAst = ast.args[1];
      if (pathAst.type !== "constant") {
        throw new Error("Expected constant");
      }
      const fullPath = pathAst.value;

      // @TODO: At some point in the future we should try handle the full
      // JSONPath spec. I'm hesitent to use libraries though since they'll be a
      // bit slower and implementations might change when we rewrite our core.
      let path = fullPath;
      let result = ast.args[0];
      while (path !== "$") {
        // See if we can find something to select, throw if not
        let select = null;
        if (path.startsWith("$.")) {
          const match = /^\$\.([$_a-zA-Z][$_a-zA-Z0-9]*)(.*?)$/.exec(path);
          if (match) {
            select = match[1];
            path = "$" + match[2];
          }
        } else if (path.startsWith("$[")) {
          const match = JSON_BRAKET_REGEX.exec(path);
          if (match) {
            select = match[1];
            path = "$" + match[2];

            // If we matched a quoted string, remove escaping
            if (select.startsWith("'") || select.startsWith('"')) {
              select = select.substring(1, select.length - 1);
              select = select.replace(/\\(.)/, "$1");
            }
          }
        }

        sqrlInvariant(ast, select, "JSONPath is not supported:: %s", fullPath);
        result = SqrlAst.call("attr", [result, SqrlAst.constant(select)]);
      }
      return result;
    }
  });

  registry.save(
    function _jsonPath(data, path) {
      return jsonpath.query(data, path);
    },
    {
      background: true
    }
  );

  registry.save(null, {
    name: "jsonPath",
    argCount: 2,
    transformAst(state: SqrlParserState, ast): Ast {
      const pathAst = ast.args[1];
      invariant(
        pathAst.type === "constant" && typeof pathAst.value === "string",
        "Expected constant string as argument to jsonPath"
      );
      return SqrlAst.call("_jsonPath", ast.args);
    }
  });

  registry.save(
    function _dataObject(...items) {
      const result = {};
      for (let idx = 0; idx < items.length; idx += 2) {
        result[SqrlObject.ensureBasic(items[idx])] = items[idx + 1];
      }
      return result;
    },
    {
      allowSqrlObjects: true,
      allowNull: true,
      pure: true
    }
  );

  registry.save(null, {
    name: "dataObject",
    transformAst(state, ast): Ast {
      sqrlInvariant(
        ast,
        ast.args.length % 2 === 0,
        "Expected even number of arguments"
      );
      return SqrlAst.call("_dataObject", ast.args);
    },
    pure: true
  });

  registry.save(
    function mergeDataObjects(...objects) {
      return Object.assign({}, ...objects);
    },
    {
      allowSqrlObjects: true
    }
  );
}
