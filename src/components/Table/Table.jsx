import React, { useRef, useState, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableHeader } from "./TableHeader";
import { TableFilter } from "./TableFilter";
import { Checkbox } from "../ui/Checkbox";
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
                    top: 25,
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
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {!loading &&
                        rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const item = data[virtualRow.index];
                            const isSelected = selectedIds.has(item.id);

                            return (
                                <div
                                    key={item.id}
                                    className={clsx(
                                        "flex items-center border-b border-gray-800 hover:bg-gray-800/50 transition-colors",
                                        isSelected && "bg-gray-800/80"
                                    )}
                                    style={{
                                        position: "absolute",
                                        top: virtualRow.start,
                                        left: 0,
                                        width: "100%",
                                        height: virtualRow.size,
                                    }}
                                >
                                    <div className="w-[50px] flex items-center justify-center p-3 border-r border-gray-800">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => handleSelectRow(item.id)}
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
                                        >
                                            {item[col.key]}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/95 z-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-400 text-sm">Loading data...</span>
                    </div>
                </div>
            )}

            {/* Click outside filter */}
            {activeFilterColumn && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setActiveFilterColumn(null)}
                />
            )}
        </div>
    );
};
