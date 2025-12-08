import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import styles from '../GroupedSortable.module.css';
import type {Item} from '../types';

interface Props {
  item: Item;
  children?: React.ReactNode;
}

export const SortableItem = ({item, children}: Props) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id: item.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.Item} ${isDragging ? styles.dragging : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children ?? item.label}
    </div>
  );
};
