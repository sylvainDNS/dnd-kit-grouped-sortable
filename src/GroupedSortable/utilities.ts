import type {DropZoneData, Item} from './types';

/**
 * Normalize positions to be sequential (e.g., 1,1,1,3,3,4 → 1,1,1,2,2,3)
 */
export const normalizePositions = (items: Item[]): Item[] => {
  const uniquePositions = Array.from(
    new Set(items.map((item) => item.position))
  ).sort((a, b) => a - b);

  const positionMap = new Map<number, number>();
  uniquePositions.forEach((pos, index) => {
    positionMap.set(pos, index + 1);
  });

  return items.map((item) => ({
    ...item,
    position: positionMap.get(item.position) ?? item.position,
  }));
};

export const groupItemsByPosition = (items: Item[]): Map<number, Item[]> => {
  const grouped = new Map<number, Item[]>();
  for (const item of items) {
    const group = grouped.get(item.position) ?? [];
    group.push(item);
    grouped.set(item.position, group);
  }
  return grouped;
};

export const getPositions = (items: Item[]): number[] =>
  Array.from(new Set(items.map((item) => item.position))).sort((a, b) => a - b);

export const isDropZone = (data: unknown): data is DropZoneData =>
  typeof data === 'object' &&
  data !== null &&
  (data as DropZoneData).type === 'drop-zone';
