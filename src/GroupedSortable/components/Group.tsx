import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import {useGroupedSortableContext} from '../context/GroupedSortableContext';
import styles from '../GroupedSortable.module.css';
import type {Item} from '../types';

interface Props {
  id: number;
  items?: Item[];
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const Group = ({id, items, children}: Props) => {
  const {groups, overGroupId} = useGroupedSortableContext();
  const groupItems = items ?? groups.get(id) ?? [];
  const isOver = overGroupId === id;

  return (
    <div className={`${styles.Group} ${isOver ? styles.groupOver : ''}`}>
      <SortableContext
        items={groupItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.GroupItems}>{children}</div>
      </SortableContext>
    </div>
  );
};
