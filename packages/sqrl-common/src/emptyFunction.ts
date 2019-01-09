/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
interface EmptyFunction {
  (): void;
  thatReturns: <T>(value: T) => (() => T);
  thatReturnsFalse: () => boolean;
  thatReturnsTrue: () => boolean;
  thatReturnsNull: () => null;
  thatReturnsThis: () => this;
  thatReturnsArgument: <T>(value: T) => T;
}

export const emptyFunction = function() {} as EmptyFunction;

Object.assign(emptyFunction as any, {
  thatReturns: makeEmptyFunction,
  thatReturnsFalse: makeEmptyFunction(false),
  thatReturnsTrue: makeEmptyFunction(true),
  thatReturnsNull: makeEmptyFunction(null),
  thatReturnsThis() {
    return this;
  },
  thatReturnsArgument(arg) {
    return arg;
  }
});
