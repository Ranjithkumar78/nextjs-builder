// Minimal ULID generator (https://github.com/ulid/spec). Themes and pages use ULIDs
// because the Stutzee API stores them with ULID primary keys.
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function ulid(): string {
  let time = Date.now();
  let timePart = "";
  for (let i = 0; i < 10; i++) {
    timePart = ENCODING[time % 32] + timePart;
    time = Math.floor(time / 32);
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let randomPart = "";
  for (let i = 0; i < 16; i++) randomPart += ENCODING[bytes[i] % 32];
  return timePart + randomPart;
}

export function isUlid(value: unknown): value is string {
  return typeof value === "string" && /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i.test(value);
}
