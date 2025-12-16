import React, { useRef, useState, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableHeader } from "./TableHeader";
import { TableFilter } from "./TableFilter";
import { Checkbox } from "../ui/Checkbox";
import { Eye } from "lucide-react";
import { clsx } from "clsx";
import { SORT_DIRECTION } from "../../constants";

export const Table = ({
    data,
    columns,
    onSelectionChange,
    onSort,
    onFilter,
    sortConfig,
    activeFilters,
    loading = false,
    viewedIds = new Map(),
}) => {
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });

    // --- Selection ---
    const handleSelectAll = useCallback(() => {
        if (selectedIds.size === data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(data.map((row) => row.id)));
        }
    }, [selectedIds.size, data]);

    const handleSelectRow = useCallback((id) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    }, []);

    useEffect(() => {
        onSelectionChange([...selectedIds]);
    }, [selectedIds, onSelectionChange]);

    // --- Sorting ---
    const handleSort = useCallback(
        (key) => {
            let direction = SORT_DIRECTION.ASC;
            if (sortConfig?.key === key && sortConfig.direction === SORT_DIRECTION.ASC) {
                direction = SORT_DIRECTION.DESC;
            }
            onSort({ key, direction });
        },
        [sortConfig, onSort]
    );

    // --- Filtering ---
    const handleFilterClick = useCallback(
        (e, key) => {
            e.stopPropagation();
            if (activeFilterColumn === key) {
                setActiveFilterColumn(null);
            } else {
                const rect = e.currentTarget.getBoundingClientRect();
                setFilterPosition({
                    top: rect.top + rect.height + 10,
                    left: rect.left - 70,
                });
                setActiveFilterColumn(key);
            }
        },
        [activeFilterColumn]
    );

    const handleFilterChange = useCallback(
        (columnKey, value) => {
            const current = activeFilters[columnKey] ?? [];
            const updated = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            onFilter(columnKey, updated);
        },
        [activeFilters, onFilter]
    );

    // --- Virtualization ---
    const parentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        overscan: 10,
    });

    return (
        <div className="flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden relative">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700">
                <TableHeader
                    columns={columns}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onFilterClick={handleFilterClick}
                    activeFilters={activeFilters}
                    onSelectAll={handleSelectAll}
                    allSelected={data.length > 0 && selectedIds.size === data.length}
                    isIndeterminate={selectedIds.size > 0 && selectedIds.size < data.length}
                />
            </div>

            {/* Filter Dropdown */}
            {activeFilterColumn && (
                <TableFilter
                    options={
                        columns.find((c) => c.key === activeFilterColumn)?.filterOptions || []
                    }
                    selectedValues={activeFilters[activeFilterColumn] || []}
                    onChange={(val) => handleFilterChange(activeFilterColumn, val)}
                    onClose={() => setActiveFilterColumn(null)}
                    position={filterPosition}
                />
            )}

            {/* Virtualized Body */}
            <div
                ref={parentRef}
                className="overflow-auto relative"
                style={{ height: "400px" }}   // ★ FIXED HEIGHT = virtualization works
            >
                {loading ? (
                    /* Loading State - Centered in table body */
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4 py-12">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-300 font-medium">Loading data...</p>
                                <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your data</p>
                            </div>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    /* Empty State - Centered in table body */
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4 py-12 px-6 max-w-md text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-gray-200 font-semibold text-lg mb-2">No results found</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We couldn't find any data matching your search or filters. Try adjusting your criteria or clearing filters to see more results.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Data Rows */
                    <div
                        style={{
                            height: rowVirtualizer.getTotalSize(),
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const item = data[virtualRow.index];
                            const isSelected = selectedIds.has(item.id);
                            const isViewed = viewedIds.get(item.id) === true;

                            return (
                                <div
                                    key={item.id}
                                    className={clsx(
                                        "flex items-center border-b border-gray-800 hover:bg-gray-800/50 transition-colors relative",
                                        isSelected && "bg-gray-800/80",
                                        isViewed && "border-l-4 border-l-green-500"
                                    )}
                                    style={{
                                        position: "absolute",
                                        top: virtualRow.start,
                                        left: 0,
                                        width: "100%",
                                        height: virtualRow.size,
                                    }}
                                    role="row"
                                    aria-selected={isSelected}
                                >
                                    {/* Viewed Indicator */}
                                    {isViewed && (
                                        <div
                                            className="absolute left-1 top-1/2 -translate-y-1/2 text-green-500"
                                            aria-label="Viewed"
                                            title="This row has been marked as viewed"
                                        >
                                            <Eye size={14} />
                                        </div>
                                    )}

                                    <div className="w-[50px] flex items-center justify-center p-3 border-r border-gray-800" role="cell">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelectRow(item.id)}
                                            aria-label={`Select row ${item.name}`}
                                        />
                                    </div>

                                    {columns.map((col) => (
                                        <div
                                            key={col.key}
                                            className="p-3 truncate text-gray-300"
                                            style={{
                                                width: col.width || "auto",
                                                flex: col.width ? "none" : 1,
                                            }}
                                            role="cell"
                                        >
                                            {item[col.key]}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
