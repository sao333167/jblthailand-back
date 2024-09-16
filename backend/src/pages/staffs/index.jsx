import React, { useEffect, useMemo, useState } from "react";
import { AreaTable, AreaTop } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import Loading from "../../components/Loading";
import { FaStreetView } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";

const TABLE_HEADS = [
    "№",
    "Name",
    "Phone",
    "Type",
    "Status",
    "Created At",
    "Login IP",
    "Action",
];

export default function Index() {
    const { getStaffs, records, PageSize, loading } = useStateContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getStaffs();
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(
            (record) =>
                record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.phone
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                record.role
                    .join(" ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) // Join the role array to a string
        );
    }, [searchQuery, records]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);
    let i= 1;
    return (
        <>
            {loading && <Loading />}
            <div className="content-area">
                <AreaTop text="Staff Managerment" />
                <AreaTable
                    title="Staff List"
                    records={filteredRecords}
                    tableHeads={TABLE_HEADS}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    PageSize={PageSize}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                >
                    {currentTableData?.map((dataItem) => (
                        <tr key={dataItem.id}>
                            <th>#{i++}</th>
                            <td>{dataItem.name}</td>
                            <td>{dataItem.phone}</td>
                            <td className="uppercase text-sm">
                                {Array.isArray(dataItem.role)
                                    ? dataItem.role.join(", ")
                                    : ""}
                            </td>{" "}
                            {/* Join the role array to a string */}
                            <td>
                                <div className="dt-status">
                                    <span
                                        className={`dt-status-dot dot-${dataItem.status}`}
                                    ></span>
                                    <span className="dt-status-text">
                                        {dataItem.status == 0
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </td>
                            <td>{dataItem.created_at}</td>
                            <td>
                                {dataItem.last_login_at}{" "}
                                {dataItem.last_login_ip}
                            </td>
                            <td className="dt-cell-action">
                                <AreaTableAction>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Login History"
                                            className="dropdown-menu-link"
                                        >
                                            <FaStreetView size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Edit"
                                            className="dropdown-menu-link"
                                        >
                                            <FaEdit size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Delete"
                                            className="dropdown-menu-link"
                                        >
                                            <RiDeleteBin6Line size={18} />
                                        </div>
                                    </li>
                                </AreaTableAction>
                            </td>
                        </tr>
                    ))}
                </AreaTable>
            </div>
        </>
    );
}
