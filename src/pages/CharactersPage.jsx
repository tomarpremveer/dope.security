import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table } from '../components/Table/Table';
import { clsx } from 'clsx';
import { fetchData } from '../api/mockApi';

export const CharactersPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    // Query Params State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState(null);
    const [filters, setFilters] = useState({});

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                filter: filters,
                sort: sortConfig,
                search: searchQuery
            });
            setData(result);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, [filters, sortConfig, searchQuery]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const columns = useMemo(() => [
        { key: 'name', label: 'Name', isSortable: false, isFilterable: false },
        { key: 'location', label: 'Location', isSortable: false, isFilterable: false },
        {
            key: 'health',
            label: 'Health',
            isSortable: false,
            isFilterable: true,
            filterOptions: ["Healthy", "Injured", "Critical"]
        },
        { key: 'power', label: 'Power', isSortable: false, isFilterable: false },
    ], []);

    const handleSelectionChange = useCallback((ids) => {
        setSelectedIds(ids);
    }, []);

    const handleLogSelected = useCallback(() => {
        console.log("Selected Entity IDs:", selectedIds);
        alert(`Logged ${selectedIds.length} IDs to console`);
    }, [selectedIds]);

    const handleSort = useCallback((config) => {
        setSortConfig(config);
    }, []);

    const handleFilter = useCallback((columnKey, values) => {
        setFilters(prev => {
            const newFilters = { ...prev, [columnKey]: values };
            if (values.length === 0) {
                delete newFilters[columnKey];
            }
            return newFilters;
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                <header className="flex justify-between items-end">
                    <button
                        onClick={handleLogSelected}
                        disabled={selectedIds.length === 0}
                        className={clsx(
                            "px-4 py-2 rounded font-medium transition-all",
                            selectedIds.length > 0
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                        )}
                    >
                        Log Selected ({selectedIds.length})
                    </button>
                </header>

                <div className="flex flex-col max-h-[550px] shadow-2xl shadow-black/50 rounded-lg border border-gray-800 bg-gray-900">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
                        <input
                            type="text"
                            placeholder="Search Characters..."
                            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 w-64 focus:outline-none focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="text-gray-400 text-sm">
                            {data.length} rows found
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <Table
                            data={data}
                            columns={columns}
                            onSelectionChange={handleSelectionChange}
                            onSort={handleSort}
                            onFilter={handleFilter}
                            sortConfig={sortConfig}
                            activeFilters={filters}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
