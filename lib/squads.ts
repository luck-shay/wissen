export function getBatchForSquad(squad: number): 1 | 2 {
  return squad <= 5 ? 1 : 2;
}

export function getSquadDefaultSeatRange(squad: number): { start: number, end: number } | null {
  if (squad < 1 || squad > 10) return null;
  // There are 5 squads per batch.
  // Batch 1 squads are indices 0-4. Seats 1-40.
  // Batch 2 squads are indices 5-9. Seats 1-40.
  const indexInBatch = (squad - 1) % 5;
  const start = indexInBatch * 8 + 1;
  const end = start + 7;
  return { start, end };
}
