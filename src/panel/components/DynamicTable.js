// DynamicTable.js
import React, { useState, useMemo } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

const DynamicTable = ({ data, columns, onRowClick, initialItemsPerPage = 12 }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const defaultColumns = useMemo(() => {
    if (data && data.length > 0) {
      return Object.keys(data[0]).map(key => ({
        header: key,
        accessor: key,
        sortable: true,
      }));
    }
    return [];
  }, [data]);

  const cols = columns && columns.length > 0 ? columns : defaultColumns;

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        try{
          if (typeof aValue === 'string') {
            return sortConfig.direction === 'ascending'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else {
            return sortConfig.direction === 'ascending'
              ? aValue - bValue
              : bValue - aValue;
          }
        }
        catch(err){
          console.error("Value sort type error:", err);
          return 0;
        }
        
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const requestSort = (accessor, sortable) => {
    if (!sortable) return;
    let direction = 'ascending';
    if (sortConfig.key === accessor && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: accessor, direction });
  };

  const handleRowClick = (row) => {
    if (onRowClick) onRowClick(row);
  };

  const handleItemsPerPageChange = (e) => {
    const value = Math.max(5, Math.min(200, Number(e.target.value)));
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPaginationItems = () => {
    const items = [];
    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div className="dynamic-table-container">
      <Table responsive="md" className="dynamic-table">
        <thead>
          <tr className="text-center">
            {cols.map((col, index) => (
              col.accessor === 'isSelected' && col.onSelectAll ? (
                <th
                  key={index}
                  onClick={(e) => { e.stopPropagation(); col.onSelectAll(e); }}
                  style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                >
                  <input
                    type="checkbox"
                    checked={col.allSelected}
                    onChange={col.onSelectAll}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              ) : (
                <th
                  key={index}
                  onClick={() => requestSort(col.accessor, col.sortable !== false)}
                  style={{ cursor: col.sortable === false ? 'default' : 'pointer', verticalAlign: 'middle' }}
                >
                  {col.header}
                  {sortConfig.key === col.accessor && (
                    sortConfig.direction === 'ascending'
                      ? <i className="ri-arrow-up-s-line ms-1"></i>
                      : <i className="ri-arrow-down-s-line ms-1"></i>
                  )}
                </th>
              )
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr className="text-center" key={rowIndex} onClick={() => handleRowClick(row)}>
              {cols.map((col, colIndex) => (
                <td key={colIndex} style={{ verticalAlign: 'middle' }}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      
      <div className="pagination-container">
        <div className="d-flex align-items-center justify-content-between mt-3">
          <div className="items-per-page-container d-flex align-items-center">
            <label htmlFor="itemsPerPage" className="me-2">Sayfa başına öğe:</label>
            <input  
              type="number"
              id="itemsPerPage"
              className="form-control"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              min="5"
              max="200"
              style={{ width: '80px' }}
            />
          </div>
          <Pagination className="mb-0">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
            {renderPaginationItems()}
            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
