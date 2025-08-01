import React from 'react';

interface Column {
  header: string;
  accessor: string; // supports nested like "customer.name"
}

interface StaticTableDataProps {
  columns: Column[];
  data: any[];
}

const getNestedValue = (obj: any, path: string): any => path.split('.').reduce((acc, key) => acc?.[key], obj);

const StaticTableData: React.FC<StaticTableDataProps> = ({ columns, data }) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  background: '#f4f4f4',
                  textAlign: 'left',
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                  }}
                >
                  {String(getNestedValue(row, col.accessor) ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

export default StaticTableData;
