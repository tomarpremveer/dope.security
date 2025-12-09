import React from "react";
import { createPortal } from "react-dom";
import { Checkbox } from "../ui/Checkbox";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const TableFilterComponent = ({
    options,
    selectedValues,
    onChange,
    onClose,
    position,
}) => {
    const filterRef = useOutsideClick(onClose);

    const content = (
        <>
            {/* BACKDROP - covers everything behind */}
            <div
                className="fixed inset-0 z-[9998]"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                }}
                onClick={onClose}
            />

            {/* FILTER PANEL */}
            <div
                ref={filterRef}
                className="fixed z-[9999] rounded-lg p-3 min-w-[220px]"
                style={{
                    top: position.top,
                    left: position.left,
                    backgroundColor: "#ffeb3b",
                    color: "#000",
                    boxShadow: `
            0 16px 40px rgba(0, 0, 0, 0.45),
            0 4px 10px rgba(0, 0, 0, 0.25),
            inset 0 0 0 1px rgba(0, 0, 0, 0.4)
          `,
                }}
            >
                <div className="space-y-2 max-h-[240px] overflow-auto">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-black/10 p-1 rounded transition-colors"
                        >
                            <Checkbox
                                checked={selectedValues.includes(option)}
                                onChange={() => onChange(option)}
                            />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export const TableFilter = React.memo(TableFilterComponent);
