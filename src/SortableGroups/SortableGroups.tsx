import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import styles from "./SortableGroups.module.css";

interface DropZoneData {
  type: "drop-zone";
  insertPosition: number;
}

interface Item {
  id: UniqueIdentifier;
  label: string;
  position: number;
}

const initialItems: Item[] = [
  { id: "a1", label: "Item A1", position: 1 },
  { id: "a2", label: "Item A2", position: 1 },
  { id: "a3", label: "Item A3", position: 1 },
  { id: "b1", label: "Item B1", position: 2 },
  { id: "b2", label: "Item B2", position: 2 },
  { id: "c1", label: "Item C1", position: 3 },
  { id: "c2", label: "Item C2", position: 3 },
  { id: "c3", label: "Item C3", position: 3 },
  { id: "c4", label: "Item C4", position: 3 },
];

/**
 * Normalize positions to be sequential (1, 1, 1, 3, 3, 4 → 1, 1, 1, 2, 2, 3)
 */
const normalizePositions = (items: Item[]): Item[] => {
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

interface SortableItemProps {
  id: UniqueIdentifier;
  label: string;
}

const SortableItem = ({ id, label }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.Item} ${isDragging ? styles.dragging : ""}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {label}
    </div>
  );
};

const ItemOverlay = ({ label }: { label: string }) => (
  <div className={`${styles.Item} ${styles.overlay}`}>{label}</div>
);

interface DropZoneProps {
  insertPosition: number;
  isActive: boolean;
}

const DropZone = ({ insertPosition, isActive }: DropZoneProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-zone-${insertPosition}`,
    data: {
      type: "drop-zone",
      insertPosition,
    } as DropZoneData,
    disabled: !isActive,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.DropZone} ${isActive ? styles.dropZoneActive : ""} ${
        isOver ? styles.dropZoneOver : ""
      }`}
    >
      <div className={styles.DropZoneIndicator}>
        <span>+ New Group</span>
      </div>
    </div>
  );
};

interface GroupProps {
  id: number;
  items: Item[];
}

const Group = ({ id, items }: GroupProps) => (
  <div className={styles.Group}>
    <SortableContext
      items={items.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className={styles.GroupItems}>
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} label={item.label} />
        ))}
      </div>
    </SortableContext>
  </div>
);

export const SortableGroups = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Derived state: group items by position
  const groups = useMemo(() => {
    const grouped = new Map<number, Item[]>();
    for (const item of items) {
      const group = grouped.get(item.position) ?? [];
      group.push(item);
      grouped.set(item.position, group);
    }
    return grouped;
  }, [items]);

  // Derived state: positions sorted
  const positions = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.position))).sort(
        (a, b) => a - b
      ),
    [items]
  );

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId),
    [items, activeId]
  );

  const findItem = (id: UniqueIdentifier) =>
    items.find((item) => item.id === id);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const isDropZone = (data: unknown): data is DropZoneData =>
    typeof data === "object" &&
    data !== null &&
    (data as DropZoneData).type === "drop-zone";

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeItem = findItem(active.id);
    if (!activeItem) return;

    // If dragging over a drop zone, don't do anything in dragOver
    // The actual creation will happen in dragEnd
    if (isDropZone(over.data.current)) return;

    const overItem = findItem(over.id);
    if (!overItem) return;

    const isOverSameGroup = activeItem.position === overItem.position;
    if (isOverSameGroup) return;

    /**
     * Move to new group
     * SortableContext only handles items within a group, so we need to update the items array directly.
     */
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== active.id);
      const overIndex = newItems.findIndex((item) => item.id === over.id);
      const updatedItem = { ...activeItem, position: overItem.position };

      newItems.splice(overIndex, 0, updatedItem);
      return normalizePositions(newItems);
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (!over) return;

    const activeItem = findItem(active.id);
    if (!activeItem) return;

    // Handle drop on a drop zone - create new group
    if (isDropZone(over.data.current)) {
      const newPosition = over.data.current.insertPosition;

      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.id === active.id ? { ...item, position: newPosition } : item
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
        setItems((prev) => arrayMove(prev, activeIndex, overIndex));
      }
    }
  };

  const isDragging = activeId !== null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.Container}>
        <DropZone insertPosition={0} isActive={isDragging} />
        {positions.map((position, index) => (
          <React.Fragment key={position}>
            <Group id={position} items={groups.get(position) ?? []} />
            <DropZone insertPosition={index + 1.5} isActive={isDragging} />
          </React.Fragment>
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeItem ? <ItemOverlay label={activeItem.label} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
