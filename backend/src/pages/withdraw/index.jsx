import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { AreaTable, AreaTop } from "../../components";
import { Tooltip } from "react-tooltip";
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { format,parseISO } from "date-fns";
import { Store } from "react-notifications-component";

const TABLE_HEADS = [
    "№",
    "Order Number",
    "With Code",
    "UserName",
    "Name",
    "Amount",
    "Status",
    "Created At",
    "Login IP",
    "Action",
];

export default function Index() {
    const { getUsers, PageSize } = useStateContext();
    const [withdraws, setWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRecords = useMemo(() => {
        return withdraws.filter((withdraw) => {
            const withdrawAmountStr = String(withdraw.amount); // Convert amount to a string
            return (
                withdrawAmountStr.includes(searchQuery.toLowerCase()) ||
                withdraw.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        });
    }, [searchQuery, withdraws]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);

    const fetchWithdraws = async () => {
        try {
            const response = await axiosClient.get("/withdraws");
            setWithdraws(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching Withdraws");
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchWithdraws();
    }, []);


    const updateWithdrawRemark = async (uuid,remark,color) => {

      
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("withdraw_remark", remark);
        formData.append("status_color", color);
        
        try{
            await axiosClient.post(`/update-withdraw-remark/${uuid}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchWithdraws(); // Refresh data after update
            Store.addNotification({
                title: "Status Updated!",
                message: `Status ${remark} is successfully!`,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 5000, onScreen: true },
            });
        }catch (error) {
            console.error("Error updating status:", error);
        }
}

    
    // if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    let i = 1;
    return (
        <>
            {loading && <Loading />}
            <div className="content-area">
                <AreaTop text="Withdraws" />
                <AreaTable
                    title="Withdraw List"
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
                            <th>
                            {dataItem.withdraw_order_number}
                            </th>
                            <th>
                            {dataItem.withdraw_code}
                            </th>
                            <th className="capitalize">
                                <Link to={`/customers/${dataItem.customer_uuid}/detail`}>
                                    <span className="border-b border-dotted">
                                        {dataItem.username}
                                    </span>
                                </Link>
                            </th>
                            <td className="capitalize">{dataItem.customer_name}</td>
                            <td className="uppercase text-sm ">
                                ₱ {dataItem.withdraw_amount}
                            </td>

                            <td>
                                <div className="dt-status">
                                    
                                    <span
                                    style={{backgroundColor:dataItem.status_color }}
                                        className={`px-2 py-1 capitalize text-[11px] text-center font-bold rounded bg-${
                                            dataItem.status_color 
                                        } `}
                                    >
                                        Withdraw is {dataItem.withdraw_remark}
                                    </span>
                                </div>
                            </td>

                           
                            <td>
                                
                            {format(parseISO(dataItem.created_at), "yyyy-MM-dd HH:mm:ss")}
                             </td>
                           
                            <td>
                                {dataItem.ip_address}
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
                                            data-tooltip-content="Confirm Withdraw"
                                            className="dropdown-menu-link"
                                            onClick={() => updateWithdrawRemark(dataItem.uuid,"successfuly","#21d335")}
                                        >
                                            <LuBadgeCheck className="text-green-600" size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Reject Withdraw"
                                            className="dropdown-menu-link"
                                            onClick={() => updateWithdrawRemark(dataItem.uuid,"reject",'#d0021b')}
                                        >
                                            <LuBadgeX className="text-red-600" size={18} />
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
