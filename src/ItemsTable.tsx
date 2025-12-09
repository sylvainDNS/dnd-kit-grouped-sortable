import type { Item } from "./GroupedSortable/types";

interface ItemsTableProps {
  items: Item[];
  title?: string;
}

export const ItemsTable = ({ items, title = "Items Data" }: ItemsTableProps) => {
  return (
    <div style={{
      marginTop: "20px",
      padding: "16px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "400px",
      marginLeft: "auto",
      marginRight: "auto",
      boxSizing: "border-box",
      textAlign: "left",
    }}>
      <h3 style={{
        margin: "0 0 12px 0",
        fontSize: "14px",
        fontWeight: "600",
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        {title}
      </h3>
      <div style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        fontSize: "12px",
        overflow: "auto",
        maxHeight: "300px",
        boxSizing: "border-box",
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "monospace",
        }}>
          <thead>
            <tr style={{
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #e0e0e0",
            }}>
              <th style={{
                padding: "8px 12px",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "11px",
                textTransform: "uppercase",
                color: "#666",
              }}>
                id
              </th>
              <th style={{
                padding: "8px 12px",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "11px",
                textTransform: "uppercase",
                color: "#666",
              }}>
                label
              </th>
              <th style={{
                padding: "8px 12px",
                textAlign: "left",
                fontWeight: "600",
                fontSize: "11px",
                textTransform: "uppercase",
                color: "#666",
              }}>
                position
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: index < items.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <td style={{
                  padding: "8px 12px",
                  color: "#5a8a3a",
                }}>
                  "{item.id}"
                </td>
                <td style={{
                  padding: "8px 12px",
                  color: "#b8860b",
                }}>
                  "{item.label}"
                </td>
                <td style={{
                  padding: "8px 12px",
                  color: "#7b5fa8",
                }}>
                  {item.position}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

