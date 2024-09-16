/* eslint-disable no-undef */
import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { AreaTable, AreaTop } from "../../components";
import { TbPasswordFingerprint } from "react-icons/tb";
import { GiSightDisabled } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { LuWallet } from "react-icons/lu";
import { BsPersonVcard } from "react-icons/bs";
import { RiBankLine } from "react-icons/ri";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { Store } from "react-notifications-component";
import { IoIosMailUnread } from "react-icons/io";
import { MdOutlineMarkEmailRead, MdQrCode2 } from "react-icons/md";
import Modal from "../../components/modal/Modal";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { FaMoneyCheckDollar } from "react-icons/fa6";

const TABLE_HEADS = [
    "№",
    "Order Number",
    "UserName",
    "Name",
    "Amount",
    "Interst Rate",
    "Loan Term",
    "Status",
    "Created At",
    "MarkAsRead",
    "IP Address",
    "Action",
];

export default function Index() {
    const {
        fetchUnreadLoans,
        getDurations,
        durations,
        PageSize,
        isOpenWithdrawCode,
        setIsOpenWithdrawCode,
        handleUpdateCode,
        getUser,
        getUserDetail,
        setWithdrawCode,
        withdrawCode,
        setIsOpenBank,
        isOpenBank,
        handleUpdateBank,
        setBankName,
        bankName,
        setBankAccount,
        bankAccount,
        btnLoading,
        handleIdentify,
        setIsOpenIdentify,
        isOpenIdentify,
        setIdNumber,
        idNumber,
        setName,
        name,
        amount,
        setAmount,
        isOpenWallet,
        setIsOpenWallet,
        getAmount,
        setRemake,
        remake,
        handleAmount,
        setBtnLoading,
    } = useStateContext();
    const [loans, setLoans] = useState([]);
    const [loan, setLoan] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [isOpenLoanDuration, setIsOpenLoanDuration] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [userId, setUserId] = useState("");

    const [loanUuId, setLoanUuId] = useState("");
    const [userUuId, setUserUuId] = useState("");
    const [inputValueName, setInputValueName] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [inputValueColor, setInputValueColor] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const filteredRecords = useMemo(() => {
        return loans.filter((loan) => {
            const loanAmountStr = String(loan.amount); // Convert amount to a string
            return (
                loanAmountStr.includes(searchQuery) ||
                (loan.customer_name &&
                    loan.customer_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
            );
        });
    }, [searchQuery, loans]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);

    const fetchLoans = async (loanUuId) => {
        if (loanUuId) {
            try {
                const response = await axiosClient.get(`/loans/${loanUuId}`);
                setLoan(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching loans");
                setLoading(false);
            }
        } else {
            try {
                const response = await axiosClient.get("/loans");
                setLoans(response.data);
                setLoading(false);
            } catch (error) {
                setError("Error fetching loans");
                setLoading(false);
            }
        }
    };

    const fetchOrderStatus = async () => {
        try {
            const response = await axiosClient.get("/loan-orderstatus");
            setOrderStatus(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching OrderStatus");
            setLoading(false);
        }
    };

    const handleUpdateReview = async () => {
        clearErrors();
        setBtnLoading(true);
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("loan_remark", inputValueName);
        formData.append("status_color", inputValueColor);
        try {
            await axiosClient.post(
                `/update-loan-remark/${loanUuId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setBtnLoading(false);
            Store.addNotification({
                title: "Update Order Status.!",
                message: "Order Status is updated!",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            });
            setIsOpenReview(false);
            fetchLoans();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                for (const key in backendErrors) {
                    setError(key, {
                        type: "manual",
                        message: backendErrors[key][0],
                    });
                }
            } else {
                console.error(error);
            }
        }
    };
    const handleUpdateLoanDuration = async () => {
        clearErrors();
        setBtnLoading(true);
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("loan_amount", selectedLoan?.loan_amount);
        formData.append("duration_id", selectedLoan?.duration_id);
        try {
            await axiosClient.post(
                `/update-loan-amount/${loanUuId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setBtnLoading(false);
            Store.addNotification({
                title: "Update Order Status.!",
                message: "Order Status is updated!",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            });
            setIsOpenLoanDuration(false);
            fetchLoans();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                for (const key in backendErrors) {
                    setError(key, {
                        type: "manual",
                        message: backendErrors[key][0],
                    });
                }
            } else {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchOrderStatus();
        fetchLoans();
        getDurations();
    }, []);

    const handleMarkAsRead = async (loanUuid) => {
        try {
            await axiosClient.post(`/loans/${loanUuid}/mark-read`);

            Store.addNotification({
                title: "Mark As Read",
                message: "Message is readed.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            });
            fetchUnreadLoans();
            fetchLoans(); // Refresh the list after marking as read
        } catch (error) {
            console.error("Error marking loan as read:", error);
        }
    };

    const handleLoanClick = (loanUuid) => {
        handleMarkAsRead(loanUuid);
        // Navigate to the loan details page or perform another action
    };

    useEffect(() => {
        if (selectedLoan && isOpenReview) {
            fetchOrderStatus(selectedLoan);
        }
    }, [isOpenReview, selectedLoan]);

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    let i = 1;
    return (
        <>
            {/* {loading && <Loading />} */}
            <div className="content-area">
                <AreaTop text="Loans" />
                <AreaTable
                    title="Loan List"
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
                            <th>{dataItem.loan_order_number}</th>
                            <th className="capitalize">
                                <Link
                                    to={`/customers/${dataItem.customer_uuid}/detail`}
                                >
                                    <span className="border-b border-dotted">
                                        {dataItem.customer_tel}
                                    </span>
                                </Link>
                            </th>
                            <td className="capitalize">
                                {dataItem.customer_name}
                            </td>

                            <td className="uppercase text-sm ">
                                ₱{" "}
                                {dataItem.loan_amount
                                    ? dataItem.loan_amount.toLocaleString(
                                          undefined,
                                          { minimumFractionDigits: 2 }
                                      )
                                    : "N/A"}
                            </td>

                            <td>{dataItem.percent} %</td>

                            <td>{dataItem.month} Months</td>
                            <td>
                                <Tooltip id="updat-review" place="top" />
                                <div
                                    data-tooltip-id="updat-review"
                                    data-tooltip-content="Updat Order Status"
                                    onClick={() => {
                                        setUserUuId(dataItem.customer_uuid);
                                        setLoanUuId(dataItem.loan_uuid);
                                        setSelectedLoan(dataItem);
                                        setIsOpenReview(true);
                                    }}
                                    style={{
                                        backgroundColor: dataItem.status_color,
                                    }}
                                    className={`px-1 py-1 text-[11px] text-center capitalize font-bold rounded cursor-pointer bg-${
                                        dataItem.status_color
                                            ? dataItem.status_color
                                            : "bg-yellow-600"
                                    } `}
                                >
                                    {dataItem.loan_remark}
                                </div>
                            </td>
                            <td>{dataItem.date}</td>
                            <td>
                                <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                        handleLoanClick(dataItem.uuid)
                                    }
                                >
                                    {dataItem.is_read == 0 ? (
                                        <>
                                            <Tooltip
                                                id="read-tooltip"
                                                place="top"
                                            />
                                            <div
                                                data-tooltip-id="read-tooltip"
                                                data-tooltip-content="Unread"
                                                className="dropdown-menu-link"
                                            >
                                                <IoIosMailUnread size={18} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip
                                                id="my-tooltip"
                                                place="top"
                                            />
                                            <div
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-content="Readed"
                                                className="dropdown-menu-link"
                                            >
                                                <MdOutlineMarkEmailRead
                                                    size={18}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </td>
                            <td>
                                {dataItem.loan_ip_address
                                    ? dataItem.loan_ip_address
                                    : "Never Login"}
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
                                            data-tooltip-content="Moddify Load"
                                            className="dropdown-menu-link"
                                            onClick={async () => {
                                                setLoanUuId(dataItem.loan_uuid); // Set loan UUID
                                                await fetchLoans(
                                                    dataItem.loan_uuid
                                                ); // Fetch the loan data
                                                setSelectedLoan(dataItem); // Set the selected loan
                                                setIsOpenLoanDuration(true); // Open the modal
                                            }}
                                        >
                                            <FaMoneyCheckDollar size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Edit Bank"
                                            className="dropdown-menu-link"
                                            onClick={() => {
                                                getUserDetail(
                                                    dataItem.customer_uuid
                                                );
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenBank(true);
                                            }}
                                        >
                                            <RiBankLine size={18} />
                                        </div>
                                    </li>

                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Edit Identify"
                                            className="dropdown-menu-link"
                                            onClick={() => {
                                                getUserDetail(
                                                    dataItem.customer_uuid
                                                );
                                                setUserUuId(
                                                    dataItem.customer_uuid
                                                );
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenIdentify(true);
                                            }}
                                        >
                                            <BsPersonVcard size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Wallet Modification"
                                            className="dropdown-menu-link"
                                            onClick={() => {
                                                getUserDetail(
                                                    dataItem.customer_uuid
                                                );
                                                setUserUuId(
                                                    dataItem.customer_uuid
                                                );
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenWallet(true);
                                            }}
                                        >
                                            <LuWallet size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Set Score"
                                            className="dropdown-menu-link"
                                        >
                                            <FaCoins size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Withdraw Code"
                                            className="dropdown-menu-link"
                                            onClick={() => {
                                                getUserDetail(
                                                    dataItem.customer_uuid
                                                );
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenWithdrawCode(true);
                                            }}
                                        >
                                            <MdQrCode2 size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Password "
                                            className="dropdown-menu-link"
                                        >
                                            <TbPasswordFingerprint size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <div
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Disable"
                                            className="dropdown-menu-link"
                                        >
                                            <GiSightDisabled size={18} />
                                        </div>
                                    </li>
                                </AreaTableAction>
                            </td>
                        </tr>
                    ))}
                </AreaTable>
            </div>
            {isOpenBank && (
                <Modal
                    isOpen={isOpenBank}
                    title="Edit Bank ."
                    setIsOpen={setIsOpenBank}
                    onClose={() => setIsOpenBank(false)}
                    onRequestClose={() => setIsOpenBank(false)}
                >
                    <form
                        onSubmit={handleSubmit(() =>
                            handleUpdateBank(userId, bankName, bankAccount)
                        )}
                    >
                        <div className="flex uppercase text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedUser?.username}
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="bank_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Name
                                </label>
                                <input
                                    {...register("bank_name", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="bank_name"
                                    id="bank_name"
                                    value={bankName}
                                    onChange={(e) =>
                                        setBankName(e.target.value)
                                    }
                                    className={`block w-full mt-1 ${
                                        errors.bank_name ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="error-sms">
                            {errors.password && (
                                <span className=" text-red-500 ">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <div className="frm_grp my-2 border-b border-gray-600 ">
                            <label
                                htmlFor="bank_acc"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Bank Account
                            </label>
                            <input
                                {...register("bank_acc", { required: true })}
                                type="text"
                                name="bank_acc"
                                id="bank_acc"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                className={`block w-full mt-1 ${
                                    errors.bank_acc ? "border-red-500" : ""
                                }`}
                            />
                            {errors.bank_acc && (
                                <span className="text-red-500">
                                    {errors.bank_acc.message}
                                </span>
                            )}
                        </div>
                        <div className="btn_wrap flex justify-end mt-4">
                            <button type="submit" className="btn">
                                <div className="flex justify-center items-center ">
                                    {btnLoading && (
                                        <CgSpinner className="animate-spin -ml-2" />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {isOpenIdentify && (
                <Modal
                    isOpen={isOpenIdentify}
                    title="Edit Identify ."
                    setIsOpen={setIsOpenIdentify}
                    onClose={() => setIsOpenIdentify(false)}
                    onRequestClose={() => setIsOpenIdentify(false)}
                >
                    <form
                        onSubmit={handleSubmit(() =>
                            handleIdentify(userUuId, name, idNumber)
                        )}
                    >
                        <div className="flex uppercase text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedUser?.username}
                            </div>
                        </div>
                        <div className=" my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    {...register("name", { required: true })}
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`block w-full mt-1 ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="error-sms">
                            {errors.name && (
                                <span className=" text-red-500 ">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                        <div className="frm_grp my-2 border-b border-gray-600 ">
                            <label
                                htmlFor="id_number"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Identify Id
                            </label>
                            <input
                                {...register("id_number", { required: true })}
                                type="text"
                                name="id_number"
                                id="id_number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                className={`block w-full mt-1 ${
                                    errors.id_number ? "border-red-500" : ""
                                }`}
                            />
                            {errors.id_number && (
                                <span className="text-red-500">
                                    {errors.id_number.message}
                                </span>
                            )}
                        </div>
                        <div className="btn_wrap flex justify-end mt-4">
                            <button type="submit" className="btn">
                                <div className="flex justify-center items-center ">
                                    {btnLoading && (
                                        <CgSpinner className="animate-spin -ml-2" />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {isOpenLoanDuration && (
                <Modal
                    isOpen={isOpenLoanDuration}
                    title="Modify Loan"
                    setIsOpen={setIsOpenLoanDuration}
                    onClose={() => setIsOpenLoanDuration(false)}
                    onRequestClose={() => setIsOpenLoanDuration(false)}
                >
                    <form onSubmit={handleSubmit(handleUpdateLoanDuration)}>
                        <div className="flex uppercase text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedLoan?.customer_name}{" "}
                                {/* Display the customer name */}
                            </div>
                        </div>

                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="loanAmount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Loan Amount
                                </label>
                                <input
                                    {...register("loanAmount", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="loanAmount"
                                    id="loanAmount"
                                    value={selectedLoan?.loan_amount || ""}
                                    onChange={(e) =>
                                        setSelectedLoan({
                                            ...selectedLoan,
                                            loan_amount: e.target.value,
                                        })
                                    }
                                    className={`capitalize block w-full mt-1 ${
                                        errors.loanAmount
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="duration"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Loan Period (Month)
                                </label>
                                <select
                                    name="duration"
                                    id="duration"
                                    value={selectedLoan?.duration_id || ""}
                                    onChange={(e) =>
                                        setSelectedLoan({
                                            ...selectedLoan,
                                            duration_id: e.target.value,
                                        })
                                    }
                                    className={`capitalize block w-full mt-1 ${
                                        errors.duration ? "border-red-500" : ""
                                    }`}
                                >
                                    {durations.map((item, i) => (
                                        <option key={i} value={item.id}>
                                            {item.month} Months
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Other form fields */}
                        <div className="btn_wrap flex justify-end mt-4">
                            <button type="submit" className="btn">
                                <div className="flex justify-center items-center">
                                    {btnLoading && (
                                        <CgSpinner
                                            className="animate-spin -ml-2"
                                            size={20}
                                        />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {isOpenReview && (
                <Modal
                    isOpen={isOpenReview}
                    title="Update Review ."
                    setIsOpen={setIsOpenReview}
                    onClose={() => setIsOpenReview(false)}
                    onRequestClose={() => setIsOpenReview(false)}
                >
                    <form onSubmit={handleSubmit(handleUpdateReview)}>
                        <div className="flex uppercase text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedLoan?.customer_name}
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-3 space-x-3">
                                {orderStatus.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setInputValueName(item.name);
                                            setInputValueColor(item.color);
                                        }}
                                        style={{
                                            backgroundColor: item.color,
                                        }}
                                        className={`px-2 py-1 my-1 text-[10px] text-nowrap capitalize text-center rounded-sm text-white font-bold cursor-pointer`}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="frm_grp ">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Order Status
                                </label>
                                <input
                                    {...register("name", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={inputValueName} // Ensure value is not null
                                    onChange={(e) =>
                                        setInputValueName(e.target.value)
                                    }
                                    className={`capitalize block w-full mt-1 ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                            <input
                                type="hidden"
                                name="color"
                                id="color"
                                value={inputValueColor} // Ensure value is not null
                                onChange={(e) =>
                                    setInputValueColor(e.target.value)
                                }
                                className={`capitalize block w-full mt-1 ${
                                    errors.color ? "border-red-500" : ""
                                }`}
                            />
                        </div>
                        <div className="error-sms">
                            {errors.color && (
                                <span className=" text-red-500 ">
                                    {errors.color.message}
                                </span>
                            )}
                        </div>

                        <div className="btn_wrap flex justify-end mt-4">
                            <button type="submit" className="btn">
                                <div className="flex justify-center items-center ">
                                    {btnLoading && (
                                        <CgSpinner
                                            className="animate-spin -ml-2"
                                            size={20}
                                        />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {isOpenWithdrawCode && (
                <Modal
                    isOpen={isOpenWithdrawCode}
                    title="Update Withdraw Code ."
                    setIsOpen={setIsOpenWithdrawCode}
                    onClose={() => setIsOpenWithdrawCode(false)}
                    onRequestClose={() => setIsOpenWithdrawCode(false)}
                >
                    <form
                        onSubmit={handleSubmit(() =>
                            handleUpdateCode(loanUuId, withdrawCode)
                        )}
                    >
                        <div className="flex uppercase text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedUser?.username}
                            </div>
                        </div>
                        {selectedUser?.loan?.length === 0 && (
                            <div className="text-center mb-2">
                                <span className="text-red-500">
                                    Loan is not apply
                                </span>
                            </div>
                        )}

                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="withdrawCode"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Update Code
                                </label>
                                <input
                                    {...register("withdrawCode", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="withdrawCode"
                                    id="withdrawCode"
                                    value={withdrawCode} // Ensure value is not null
                                    onChange={(e) =>
                                        setWithdrawCode(e.target.value)
                                    }
                                    disabled={selectedUser?.loan?.length === 0} // Disable input if loan array is empty
                                    className={`block w-full mt-1 ${
                                        errors.withdrawCode
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="error-sms">
                            {errors.withdrawCode && (
                                <span className="text-red-500">
                                    {errors.withdrawCode.message}
                                </span>
                            )}
                        </div>

                        <div className="btn_wrap flex justify-end mt-4">
                            <button
                                type="submit"
                                className="btn"
                                disabled={selectedUser?.loan?.length === 0} // Disable submit button if loan array is empty
                            >
                                <div className="flex justify-center items-center ">
                                    {btnLoading && (
                                        <CgSpinner className="animate-spin -ml-2" />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {isOpenWallet && (
                <Modal
                    isOpen={isOpenWallet}
                    title="Update Wallet ."
                    setIsOpen={setIsOpenWallet}
                    onClose={() => setIsOpenWallet(false)}
                    onRequestClose={() => setIsOpenWallet(false)}
                >
                    <div className="flex uppercase justify-between items-center">
                        <div className="flex text-gray-800 text-sm">
                            Username:
                            <div className="ml-2 ">
                                {selectedUser?.username}
                            </div>
                        </div>
                        <div className="text-sm mr-4">Current Amount:</div>
                        <div className="flex font-bold">
                            {getAmount}
                            <div className="ml-2">{""}₱</div>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit(() =>
                            handleAmount(
                                amount,
                                userId,
                                userUuId,
                                getAmount,
                                remake
                            )
                        )}
                    >
                        {selectedUser?.loan?.length === 0 && (
                            <div className="text-center mb-2">
                                <span className="text-red-500">
                                    Loan is not apply
                                </span>
                            </div>
                        )}

                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="amount"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Set Amount
                                </label>
                                <input
                                    {...register("amount", { required: true })}
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) =>  setAmount(e.target.value)}
                                    disabled={selectedUser?.loan?.length === 0} // Disable input if loan array is empty
                                    className={`block w-full mt-1 ${
                                        errors.amount ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                        </div>
                        <div className="error-sms">
                            {errors.amount && (
                                <span className=" text-red-500 ">
                                    {errors.amount.message}
                                </span>
                            )}
                        </div>
                        <div className="frm_grp my-2">
                            <label
                                htmlFor="remake"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Remake
                            </label>
                            <textarea
                                {...register("remake", { required: true })}
                                type="text"
                                name="remake"
                                id="remake"
                                value={remake} // Ensure value is not null
                                onChange={(e) => setRemake(e.target.value)}
                                disabled={selectedUser?.loan?.length === 0} // Disable input if loan array is empty
                                className={`block w-full mt-1 ${
                                    errors.remake ? "border-red-500" : ""
                                }`}
                            />
                            {errors.remake && (
                                <span className="text-red-500">
                                    {errors.remake.message}
                                </span>
                            )}
                        </div>

                        <div className="btn_wrap flex justify-end mt-4">
                            <button type="submit" className="btn">
                                <div className="flex justify-center items-center ">
                                    {btnLoading && (
                                        <CgSpinner className="animate-spin -ml-2" />
                                    )}
                                    Update
                                </div>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
