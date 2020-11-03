
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