// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import { AreaTable, AreaTop } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { Tooltip } from "react-tooltip";
import { RiDeleteBin6Line } from "react-icons/ri";

const TABLE_HEADS = [
    "№",
    "Name",
    "Value",
    "Status",
    "Created By",
    "Created At",
    "IP Address",
    "Action",
];

export default function Index() {
    const { getSystemSetting, records, PageSize, loading } = useStateContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        getSystemSetting();
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
let i =1
    return (
        <>
            {loading && <Loading />}
            <div className="content-area">
                <AreaTop text="Staff Managerment" />
                <AreaTable
                    text="Staff List"
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
                            <th>{i++}</th>
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
                                        <Link
                                            to={"/view"}
                                            className="dropdown-menu-link"
                                        >
                                            View
                                        </Link>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Link
                                            to={"/view"}
                                            className="dropdown-menu-link"
                                        >
                                            Edit
                                        </Link>
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
