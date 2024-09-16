import React, { useEffect, useMemo, useState } from "react";
import { AreaTable, AreaTop } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import Loading from "../../components/Loading";
import { FaStreetView } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { format } from "date-fns";

const TABLE_HEADS = [
    "№",
    "Month",
    "percent",
    "Status",
    "Created At",
    "Ip Address",
    "Action",
];

export default function Index() {
    const { getDurations, records, PageSize, loading } = useStateContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getDurations();
    }, []);

    const filteredRecords = useMemo(() => {
        // Ensure records is defined before filtering
        if (!records) return [];

        return records.filter(
            (record) =>
                record.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.percent.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, records]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);

    let i = 1;
    return (
        <>
            {loading && <Loading />}
            <div className="content-area">
                <AreaTop text="Duration Management" />
                <AreaTable
                    title="Duration List"
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
                            <td>{dataItem.mont} Month</td>
                            <td>{dataItem.percent} %</td>
                          
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
                            <td> {format(
                                    new Date(dataItem.created_at),
                                    "dd-MM-yyyy"
                                )}</td>
                            <td>
                                {dataItem.lip_address}{" "}
                               
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
