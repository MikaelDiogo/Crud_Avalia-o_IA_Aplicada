export function parseProductIdParam(
  raw: string | string[] | undefined,
): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s === undefined || s === '' || !/^\d+$/.test(s)) {
    return Number.NaN;
  }
  return Number.parseInt(s, 10);
}
