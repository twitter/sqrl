import { runSqrlTest } from "../../src/api/simple/runSqrlTest";

/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */

test("charGrams", async () => {
  await runSqrlTest(`
LET RawActorEmail := "pete.HUNT1+978@gmail.com";
LET ActorEmail := normalizeEmail(RawActorEmail);

ASSERT ActorEmail = "petehunt1@gmail.com";
    `);
});
