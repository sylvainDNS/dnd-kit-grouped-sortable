import * as React from 'react';
import type {GroupedSortableContextValue} from '../types';

const GroupedSortableContext =
  React.createContext<GroupedSortableContextValue | null>(null);

interface ProviderProps {
  value: GroupedSortableContextValue;
  children: React.ReactNode;
}

export const GroupedSortableProvider = ({value, children}: ProviderProps) => (
  <GroupedSortableContext.Provider value={value}>
    {children}
  </GroupedSortableContext.Provider>
);

export const useGroupedSortableContext = (): GroupedSortableContextValue => {
  const context = React.useContext(GroupedSortableContext);
  if (!context) {
    throw new Error(
      'useGroupedSortableContext must be used within GroupedSortableProvider'
    );
  }
  return context;
};
