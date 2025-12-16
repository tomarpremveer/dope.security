import React from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';

const TableHeaderComponent = ({
    columns,
    onSort,
    sortConfig,
    onFilterClick,
    activeFilters,
    onSelectAll,
    allSelected,
    isIndeterminate
}) => {
    return (
        <div
            className="flex items-center border-b border-gray-700 bg-gray-900 text-gray-300 font-medium text-sm sticky top-0 z-10"
            role="row"
        >
            {/* Selection Column Header */}
            <div className="w-[50px] flex items-center justify-center p-3 border-r border-gray-700" role="columnheader">
                <Checkbox
                    checked={allSelected}
                    ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={onSelectAll}
                    aria-label="Select all rows"
                />
            </div>

            {/* Dynamic Columns */}
            {columns.map((col) => (
                <div
                    key={col.key}
                    className="flex items-center p-3"
                    style={{ width: col.width || 'flex-1', flex: col.width ? 'none' : 1 }}
                    role="columnheader"
                    aria-sort={
                        sortConfig?.key === col.key
                            ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                            : col.isSortable ? 'none' : undefined
                    }
                >
                    <span className="mr-2">{col.label}</span>

                    {/* Sorting with Chevron Icons */}
                    {col.isSortable && (
                        <button
                            onClick={() => onSort(col.key)}
                            className="p-1 hover:bg-gray-800 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={`Sort by ${col.label} ${sortConfig?.key === col.key
                                    ? sortConfig.direction === 'asc' ? 'descending' : 'ascending'
                                    : 'ascending'
                                }`}
                        >
                            {sortConfig?.key === col.key ? (
                                sortConfig.direction === 'asc' ? (
                                    <ChevronUp size={16} className="text-indigo-400" />
                                ) : (
                                    <ChevronDown size={16} className="text-indigo-400" />
                                )
                            ) : (
                                <ChevronUp size={16} className="text-gray-600" />
                            )}
                        </button>
                    )}

                    {/* Filtering */}
                    {col.isFilterable && (
                        <button
                            onClick={(e) => onFilterClick(e, col.key)}
                            className={`ml-auto p-1 rounded transition-colors ${activeFilters[col.key]?.length > 0 ? 'text-indigo-400' : 'hover:bg-gray-800'}`}
                            aria-label={`Filter ${col.label}`}
                        >
                            <Filter size={14} />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export const TableHeader = React.memo(TableHeaderComponent);
