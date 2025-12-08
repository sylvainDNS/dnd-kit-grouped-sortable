import {useDroppable} from '@dnd-kit/core';

import {useGroupedSortableContext} from '../context/GroupedSortableContext';
import styles from '../GroupedSortable.module.css';
import type {DropZoneData} from '../types';

interface Props {
  insertPosition: number;
  isActive?: boolean;
  children?: React.ReactNode;
}

export const DropZone = ({insertPosition, isActive, children}: Props) => {
  const {isDragging} = useGroupedSortableContext();

  const {setNodeRef, isOver} = useDroppable({
    id: `drop-zone-${insertPosition}`,
    data: {
      type: 'drop-zone',
      insertPosition,
    } as DropZoneData,
    disabled: !(isActive ?? isDragging),
  });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.DropZone} ${
        isActive ?? isDragging ? styles.dropZoneActive : ''
      } ${isOver ? styles.dropZoneOver : ''}`}
    >
      <div className={styles.DropZoneIndicator}>
        <span>{children ?? '+ New Group'}</span>
      </div>
    </div>
  );
};
