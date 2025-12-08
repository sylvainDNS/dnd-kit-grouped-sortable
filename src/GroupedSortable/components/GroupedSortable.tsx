import {createPortal} from 'react-dom';
import {DndContext, DragOverlay, closestCenter} from '@dnd-kit/core';

import {useGroupedSortable} from '../hooks/useGroupedSortable';
import {GroupedSortableProvider} from '../context/GroupedSortableContext';
import type {Item} from '../types';
import {ItemOverlay} from './ItemOverlay';

interface Props {
  items: Item[];
  onItemsChange: React.Dispatch<React.SetStateAction<Item[]>>;
  children: React.ReactNode;
}

export const GroupedSortable = ({items, onItemsChange, children}: Props) => {
  const {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    activeItem,
    positions,
    groups,
    isDragging,
    activeId,
    findItem,
    setActiveId,
  } = useGroupedSortable({items, onItemsChange});

  const setItems = (updater: Item[] | ((items: Item[]) => Item[])) => {
    onItemsChange(
      typeof updater === 'function'
        ? (prev) => (updater as (items: Item[]) => Item[])(prev)
        : updater
    );
  };

  return (
    <GroupedSortableProvider
      value={{
        items,
        positions,
        groups,
        activeId,
        activeItem,
        isDragging,
        findItem,
        setActiveId,
        setItems,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {children}

        {createPortal(
          <DragOverlay>
            {activeItem ? <ItemOverlay item={activeItem} /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </GroupedSortableProvider>
  );
};
