# GroupedSortable (Compound Components)

Declarative, fully custom layout for grouped sortable lists using `@dnd-kit`. All UI is composed from primitives; layout is user-defined via context.

## Folder Structure

```
GroupedSortable/
├── index.ts                    # Public API
├── types.ts                    # Shared types
├── utilities.ts                # Pure helpers
├── context/GroupedSortableContext.tsx
├── hooks/useGroupedSortable.ts
├── components/
│   ├── GroupedSortable.tsx     # Provider + DndContext + DragOverlay
│   ├── Group.tsx               # SortableContext wrapper for a group
│   ├── SortableItem.tsx        # Draggable item primitive
│   ├── ItemOverlay.tsx         # Drag overlay renderer
│   └── DropZone.tsx            # Droppable “create/move group” zone
├── GroupedSortable.module.css  # Default styles for primitives
```

## Usage (full control layout)

```tsx
import React, {useState} from 'react';
import {
  GroupedSortable,
  Group,
  SortableItem,
  DropZone,
  useGroupedSortableContext,
  type Item,
} from './GroupedSortable';

const initial: Item[] = [
  {id: 'a1', label: 'Item A1', position: 1},
  {id: 'b1', label: 'Item B1', position: 2},
];

function Layout() {
  const {positions, groups} = useGroupedSortableContext();
  return (
    <div className="container">
      <DropZone insertPosition={0} />
      {positions.map((pos, index) => (
        <React.Fragment key={pos}>
          <Group id={pos}>
            {groups.get(pos)?.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </Group>
          <DropZone insertPosition={index + 1.5} />
        </React.Fragment>
      ))}
    </div>
  );
}

export function Example() {
  const [items, setItems] = useState<Item[]>(initial);
  return (
    <GroupedSortable items={items} onItemsChange={setItems}>
      <Layout />
    </GroupedSortable>
  );
}
```

## API

### `<GroupedSortable items onItemsChange>{children}</GroupedSortable>`

- Provides context and DndContext. Children render any layout using primitives.

### Primitives (compound components)

- `Group`: wraps a position; adds `SortableContext`. Optional `title` and `items` props (defaults to context groups).
- `SortableItem`: draggable item. Accepts `item` and optional `children` (custom rendering).
- `DropZone`: droppable “new group” slot. Props: `insertPosition`, optional `isActive`, optional custom children.
- `ItemOverlay`: used internally by provider DragOverlay; can be reused for custom overlays.

### Hook

- `useGroupedSortableContext()` returns:
  - `items`, `positions`, `groups`
  - `activeId`, `activeItem`, `isDragging`
  - `findItem(id)`, `setActiveId`, `setItems`

### Utilities

- `normalizePositions(items)`: re-sequences positions (1-based, dense).
- `groupItemsByPosition(items)`: Map of position → items.
- `getPositions(items)`: sorted unique positions.
- `isDropZone(data)`: type guard for drop-zone data.

## Notes

- Pattern: compound components + context; no render-prop children required.
- Layout is entirely user-controlled; primitives supply behavior and default styles only.
