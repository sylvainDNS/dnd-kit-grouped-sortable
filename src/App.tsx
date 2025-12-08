import * as React from "react";
import { SortableGroups } from "./SortableGroups";
import "./styles.css";
import { DropZone, Group, GroupedSortable, SortableItem, useGroupedSortableContext, type Item } from "./GroupedSortable";

const initialItems = [
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

const Layout = () => {
  const { positions, groups } = useGroupedSortableContext();

  return (
    <div className="Container">
      <DropZone insertPosition={0} />
      {positions.map((position, index) => (
        <React.Fragment key={position}>
          <Group id={position}>
            {groups.get(position)?.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </Group>
          <DropZone insertPosition={index + 1.5} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default function App() {
  const [items, setItems] = React.useState<Item[]>(initialItems);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th scope="col">Simplified POC</th>
            <th scope="col">Reusable components</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <SortableGroups />
            </td>
            <td>
              <GroupedSortable items={items} onItemsChange={setItems}>
                <Layout />
              </GroupedSortable>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
