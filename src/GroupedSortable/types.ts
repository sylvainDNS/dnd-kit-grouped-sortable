import type {UniqueIdentifier} from '@dnd-kit/core';

export interface Item {
  id: UniqueIdentifier;
  label: string;
  position: number;
}

export interface DropZoneData {
  type: 'drop-zone';
  insertPosition: number;
}

export interface GroupedSortableContextValue {
  items: Item[];
  positions: number[];
  groups: Map<number, Item[]>;
  activeId: UniqueIdentifier | null;
  activeItem: Item | undefined;
  isDragging: boolean;
  findItem(id: UniqueIdentifier): Item | undefined;
  setActiveId(id: UniqueIdentifier | null): void;
  setItems(updater: (items: Item[]) => Item[] | Item[]): void;
}
