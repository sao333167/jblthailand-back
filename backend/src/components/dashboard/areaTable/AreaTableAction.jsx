import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import "./AreaTable.scss";

export default function AreaTableAction({ children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <button
                type="button"
                className="action-dropdown-btn"
                onClick={handleDropdown}
            >
                <HiDotsHorizontal size={18} />

                {showDropdown && (
                    <div className="action-dropdown-menu" ref={dropdownRef}>
                        <ul className="dropdown-menu-list">{children}</ul>
                    </div>
                )}
            </button>
        </div>
    );
}
