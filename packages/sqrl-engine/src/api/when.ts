/**
 * Copyright 2019 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
export interface FiredRule {
  name: string;
  reason: string | null;
}
export interface WhenCause {
  firedRules: FiredRule[];
}
