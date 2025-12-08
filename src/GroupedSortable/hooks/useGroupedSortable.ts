import * as React from 'react';
import {
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  useSensors,
  useSensor,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';

import {
  groupItemsByPosition,
  normalizePositions,
  getPositions,
  isDropZone,
} from '../utilities';
import type {Item} from '../types';

interface UseGroupedSortableProps {
  items: Item[];
  onItemsChange: React.Dispatch<React.SetStateAction<Item[]>>;
}

export const useGroupedSortable = ({
  items,
  onItemsChange,
}: UseGroupedSortableProps) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const groups = React.useMemo(() => groupItemsByPosition(items), [items]);
  const positions = React.useMemo(() => getPositions(items), [items]);
  const activeItem = React.useMemo(
    () => items.find((item) => item.id === activeId),
    [items, activeId]
  );

  const findItem = React.useCallback(
    (id: UniqueIdentifier) => items.find((item) => item.id === id),
    [items]
  );

  const handleDragStart = React.useCallback(({active}: DragStartEvent) => {
    setActiveId(active.id);
  }, []);

  const handleDragOver = React.useCallback(
    ({active, over}: DragOverEvent) => {
      if (!over) return;

      const activeItem = findItem(active.id);
      if (!activeItem) return;

      // If dragging over a drop zone, don't do anything in dragOver
      // The actual creation will happen in dragEnd
      if (isDropZone(over.data?.current)) return;

      const overItem = findItem(over.id);
      if (!overItem) return;

      const isOverSameGroup = activeItem.position === overItem.position;
      if (isOverSameGroup) return;

      /**
       * Move to new group
       * SortableContext only handles items within a group, so we need to update the items array directly.
       */
      onItemsChange((prev) => {
        const newItems = prev.filter((item) => item.id !== active.id);
        const overIndex = newItems.findIndex((item) => item.id === over.id);
        const updatedItem = {...activeItem, position: overItem.position};

        newItems.splice(overIndex, 0, updatedItem);
        return normalizePositions(newItems);
      });
    },
    [findItem, onItemsChange]
  );

  const handleDragEnd = React.useCallback(
    ({active, over}: DragEndEvent) => {
      setActiveId(null);

      if (!over) return;

      const activeItem = findItem(active.id);
      if (!activeItem) return;

      // Handle drop on a drop zone - create new group
      if (isDropZone(over.data?.current)) {
        const newPosition = over.data.current.insertPosition;

        onItemsChange((prev) => {
          const newItems = prev.map((item) =>
            item.id === active.id ? {...item, position: newPosition} : item
          );
          return normalizePositions(newItems);
        });
        return;
      }

      const overItem = findItem(over.id);
      if (!overItem) return;

      // Reorder within same group
      if (activeItem.position === overItem.position) {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
          onItemsChange((prev) => arrayMove(prev, activeIndex, overIndex));
        }
      }
    },
    [findItem, items, onItemsChange]
  );

  const isDragging = activeId !== null;

  return {
    sensors,
    activeId,
    activeItem,
    positions,
    groups,
    isDragging,
    findItem,
    setActiveId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
