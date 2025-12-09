import React from 'react';
import { Checkbox } from '../ui/Checkbox';

const TableFilterComponent = ({
    options,
    selectedValues,
    onChange,
    onClose,
    position
}) => {
    return (
        <div
            className="absolute z-50 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl shadow-black/80 p-3 min-w-[180px]"
            style={{ top: position.top, left: position.left }}
        >
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-1 rounded transition-colors">
                        <Checkbox
                            checked={selectedValues.includes(option)}
                            onChange={() => onChange(option)}
                        />
                        <span className="text-gray-200 text-sm">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export const TableFilter = React.memo(TableFilterComponent);
