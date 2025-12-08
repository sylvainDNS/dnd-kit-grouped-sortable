import styles from '../GroupedSortable.module.css';
import type {Item} from '../types';

interface Props {
  item: Item;
  children?: React.ReactNode;
}

export const ItemOverlay = ({item, children}: Props) => (
  <div className={`${styles.Item} ${styles.overlay}`}>
    {children ?? item.label}
  </div>
);
