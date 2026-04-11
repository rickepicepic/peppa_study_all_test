export function weightedPick(entries, randomFn = Math.random) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  const target = randomFn() * totalWeight;
  let cursor = 0;

  for (const entry of entries) {
    cursor += entry.weight;
    if (target <= cursor) return entry.value;
  }

  return entries[entries.length - 1].value;
}
