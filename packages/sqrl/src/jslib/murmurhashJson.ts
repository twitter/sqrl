/**
 * Copyright 2018 Twitter, Inc.
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
import murmur128x64 = require("murmur-128");
import stringify = require("fast-stable-stringify");
import { TextEncoder } from "util";

const hexDigits = [];
for (let i = 0; i < 256; i++) {
    const hexOctet = i.toString(16).padStart(2, "0");
    hexDigits.push(hexOctet);
}

export function arrayToHex(data: Uint8Array): string {
  const digits = new Array(data.byteLength);
  for (let i = 0; i < data.length; i++) {
      digits.push(hexDigits[data[i]]);
  }
  return digits.join("");
}


export function murmurhashJsonHexSync(input: any): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(stringify(input));
  return murmurhashHexSync(data);
}

export async function murmurhashJsonHex(data: any): Promise<string> {
  return murmurhashJsonHexSync(data);
}
export async function murmurhashJson(data: any): Promise<Uint8Array> {
  const inputBuffer = Buffer.from(stringify(data), "utf8");
  return murmurhashSync(inputBuffer);
}

export function murmurhashHexSync(data: Uint8Array): string {
  return arrayToHex(murmurhashSync(data));
}
export function murmurhashSync(data: Uint8Array): Uint8Array {
  return new Uint8Array(murmur128x64(data.buffer));
}
