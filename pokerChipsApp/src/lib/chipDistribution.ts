/**
 * Chip denominations and their colors for the poker table.
 */
export const CHIP_DENOMINATIONS = [
  { value: 500, color: '#7c3aed', label: '500', accentColor: '#a78bfa' },
  { value: 100, color: '#1a1a1a', label: '100', accentColor: '#666666' },
  { value: 50, color: '#16a34a', label: '50', accentColor: '#4ade80' },
  { value: 20, color: '#2563eb', label: '20', accentColor: '#60a5fa' },
  { value: 5, color: '#dc2626', label: '5', accentColor: '#f87171' },
] as const;

/** Distribution ratios for each denomination (must sum to 1.0) */
const DISTRIBUTION_RATIOS = [0.50, 0.20, 0.15, 0.10, 0.05];

export interface ChipCount {
  value: number;
  count: number;
  color: string;
  label: string;
  accentColor: string;
}

/**
 * Distributes a total stack value into chip counts by denomination.
 * Uses a ratio-based distribution that ensures all chips are used
 * and the total value is exactly matched.
 */
export function distributeChips(totalStack: number): ChipCount[] {
  const chips: ChipCount[] = CHIP_DENOMINATIONS.map((denom, index) => {
    const targetValue = totalStack * DISTRIBUTION_RATIOS[index];
    const count = Math.floor(targetValue / denom.value);
    return {
      value: denom.value,
      count: Math.max(count, 1), // At least 1 of each
      color: denom.color,
      label: denom.label,
      accentColor: denom.accentColor,
    };
  });

  // Calculate remaining value and add to smallest denomination
  const currentTotal = chips.reduce((sum, c) => sum + c.value * c.count, 0);
  const remainder = totalStack - currentTotal;

  if (remainder > 0) {
    // Add remainder as smallest denomination chips (value: 5)
    const smallestChip = chips[chips.length - 1];
    smallestChip.count += Math.floor(remainder / smallestChip.value);
  }

  return chips;
}

/**
 * Calculate total value from chip counts.
 */
export function calculateTotalValue(chips: ChipCount[]): number {
  return chips.reduce((sum, c) => sum + c.value * c.count, 0);
}
