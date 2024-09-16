import React, { useEffect, useMemo, useState } from "react";
import { AreaTable, AreaTop } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import { Link } from "react-router-dom";
import { TbPasswordFingerprint } from "react-icons/tb";
import { LuWallet } from "react-icons/lu";
import { FaCoins } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { GiSightDisabled } from "react-icons/gi";
import { RiBankLine } from "react-icons/ri";
import { BsPersonVcard } from "react-icons/bs";
import Modal from "../../components/modal/Modal";
import { useForm } from "react-hook-form";
import axiosClient from "../../axios";
import { Store } from "react-notifications-component";
import Loading from "../../components/Loading";
import { MdQrCode2 } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

const TABLE_HEADS = [
    "№",
    "Phone",
    "Name",
    "Wallet",
    "With Code",
    "Status",
    "Score",
    "Pass",
    "Created At",
    "Note",
    "Login IP",
    "Action",
];

export default function Index() {
    const {
        getUsers,
        records,
        PageSize,
        setLoading,
        loading,
        setIsOpenBank,
        isOpenBank,
        handleUpdateBank,
        btnLoading,
        handleIdentify,
        setIsOpenIdentify,
        isOpenIdentify,
        setIsOpenScore,
        isOpenScore,
        setIsOpenWallet,
        isOpenWallet,
        setIsOpenPass,
        isOpenPass,
        setIsOpenWithdrawCode,
        isOpenWithdrawCode,
        handleScore,
        handleUpdateCode,
        handlePassword,
        handleAmount,
        setBankAccount,
        bankAccount,
        setBankName,
        bankName,
        
    } = useStateContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                await getUsers();
            } catch (error) {
                console.error("Error fetching online users:", error);
            }
        };
        // Fetch online users every 5 minutes
        fetchAllUsers();
        const intervalId = setInterval(fetchAllUsers, 300000); // 5 minutes

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(
            (record) =>
                (record.name &&
                    record.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (record.username &&
                    record.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (record.tel &&
                    record.tel
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, records]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();
    
    const [name, setName] = useState("");
    const [score, setScore] = useState("");
    const [getAmount, setGetAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [remake, setRemake] = useState("");
    const [userId, setUserId] = useState("");
    const [userUuId, setUserUuId] = useState("");
    const [loanUuId, setLoanUuId] = useState("");
    const [password, setPassword] = useState("");
    const [withdrawCode, setWithdrawCode] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [username, setUsername] = useState("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUserData = async (dataItem) => {
        // setLoading(true);
        setUserId(dataItem.id);
        setUserUuId(dataItem.uuid);
        setLoanUuId(
            dataItem.loan && dataItem.loan.length > 0
                ? dataItem.loan[0].uuid
                : ""
        );
        setWithdrawCode(
            dataItem.loan && dataItem.loan.length > 0
                ? dataItem.loan[0].loan_withdraw_code
                : "000000"
        );

        if (!dataItem || !dataItem.uuid) {
            console.error(
                "Invalid dataItem passed to fetchUserData:",
                dataItem
            );
            return;
        }

        setBankName("");
        setBankAccount("");
        setName("");
        setIdNumber("");
        setScore("");
        setAmount(""); // Reset amount initially
        setUsername("");
        setPassword("");
        setPasswordConfirmation("");
        setWithdrawCode("");
        setRemake("");

        try {
            const response = await axiosClient.get(`/users/${dataItem.uuid}`);
            const userData = response.data.user;

            setGetAmount(userData.amount !== null ? userData.amount : 0); // Set amount to 0 if it's null
            setScore(userData.score || "");
            setUsername(userData.username || "");
            setWithdrawCode(userData.loan[0]?.loan_withdraw_code || "");
            setBankName(userData?.bank[0]?.bank_name || "");
            setBankAccount(userData?.bank[0]?.bank_acc || "");
            setName(userData?.document_id[0]?.name || "");
            setIdNumber(userData?.document_id[0]?.id_number || "");
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            selectedUser &&
            (isOpenBank ||
                isOpenIdentify ||
                isOpenScore ||
                isOpenWallet ||
                isOpenPass ||
                isOpenWithdrawCode)
        ) {
            fetchUserData(selectedUser);
        }
    }, [
        isOpenBank,
        isOpenIdentify,
        isOpenScore,
        selectedUser,
        isOpenWallet,
        isOpenPass,
        isOpenWithdrawCode,
    ]);
    let i = 1;
    return (
        <>
            {loading && <Loading />}
            <div className="content-area">
                <AreaTop text="Customers" />
                <AreaTable
                    title="Customer List"
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
                            <th>#{i++} </th>
                            <th className="capitalize">
                                <div className="dt-status">
                                    <span
                                        className={`dt-status-dot dot-${
                                            dataItem.is_online == false
                                                ? null
                                                : 0
                                        }`}
                                    ></span>
                                    <Link
                                        to={`/customers/${dataItem.uuid}/detail`}
                                    >
                                        <span className="border-b border-dotted">
                                            {dataItem.tel}
                                        </span>
                                    </Link>
                                </div>
                            </th>
                            <td className="capitalize">{dataItem.name}</td>

                            <td className="uppercase text-sm ">
                                ₱ {dataItem.amount}
                            </td>

                            <td className="uppercase text-sm ">
                                {dataItem.loan && dataItem.loan.length > 0
                                    ? dataItem.loan[0].loan_withdraw_code
                                    : "000000"}
                            </td>
                            <td>
                                <div className="dt-status">
                                    {/* <span className={`dt-status-dot`}></span> */}
                                    <span
                                        className={`dt-status-text ${
                                            dataItem.suspended == 0
                                                ? "bg-green-700"
                                                : "bg-red-700"
                                        } px-3 py-[2px] text-[11px] rounded`}
                                    >
                                        {dataItem.suspended == 0
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>
                            </td>
                            <td className="uppercase text-sm ">
                                {dataItem.score}
                            </td>
                            <td>
                                <Tooltip id="pass-tooltip" place="left-start" />
                                <div
                                    data-tooltip-id="Pass-tooltip"
                                    data-tooltip-content="Change Password "
                                    onClick={() => {
                                        setUserId(dataItem.id);
                                        setSelectedUser(dataItem);
                                        setIsOpenPass(true);
                                    }}
                                    className="dropdown-menu-link cursor-pointer"
                                >
                                    <TbPasswordFingerprint size={18} />
                                </div>
                            </td>
                            <td>{dataItem.created_at}</td>
                            <td>{"Transactions Note"}</td>
                            <td>
                                {dataItem.last_login_ip
                                    ? dataItem.last_login_ip
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
                                            data-tooltip-content="Edit Bank"
                                            onClick={() => {
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenBank(true);
                                            }}
                                            className="dropdown-menu-link"
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
                                            onClick={() => {
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenIdentify(true);
                                            }}
                                            className="dropdown-menu-link"
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
                                            onClick={() => {
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenWallet(true);
                                            }}
                                            className="dropdown-menu-link"
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
                                            onClick={() => {
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenScore(true);
                                            }}
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
                                            onClick={() => {
                                                setUserId(dataItem.id);
                                                setSelectedUser(dataItem);
                                                setIsOpenWithdrawCode(true);
                                            }}
                                            className="dropdown-menu-link"
                                        >
                                            <MdQrCode2 size={18} />
                                        </div>
                                    </li>
                                    <li className="dropdown-menu-item">
                                        <Tooltip
                                            id="my-tooltip"
                                            place="left-start"
                                        />
                                        <Link
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content="Disable"
                                            to={"/view"}
                                            className="dropdown-menu-link"
                                        >
                                            <GiSightDisabled size={18} />
                                        </Link>
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

            {isOpenScore && (
                <Modal
                    isOpen={isOpenScore}
                    title="Update Score ."
                    setIsOpen={setIsOpenScore}
                    onClose={() => setIsOpenScore(false)}
                    onRequestClose={() => setIsOpenScore(false)}
                >
                    <form
                        onSubmit={handleSubmit(() =>
                            handleScore(userUuId, score)
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
                                    htmlFor="score"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Set Score
                                </label>
                                <input
                                    {...register("score", { required: true })}
                                    type="text"
                                    name="score"
                                    id="score"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className={`block w-full mt-1 ${
                                        errors.score ? "border-red-500" : ""
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

            {isOpenPass && (
                <Modal
                    isOpen={isOpenPass}
                    title="Update Password ."
                    setIsOpen={setIsOpenPass}
                    onClose={() => setIsOpenPass(false)}
                    onRequestClose={() => setIsOpenPass(false)}
                >
                    <form
                        onSubmit={handleSubmit(() =>
                            handlePassword(
                                userUuId,
                                username,
                                password,
                                passwordConfirmation
                            )
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
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    New Password
                                </label>
                                <input
                                    {...register("password", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="password"
                                    id="password"
                                    value={password} // Ensure value is not null
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className={`block w-full mt-1 ${
                                        errors.password ? "border-red-500" : ""
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
                        <div className="my-2">
                            <div className="frm_grp">
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    {...register("password_confirmation", {
                                        required: true,
                                    })}
                                    type="text"
                                    name="password_confirmation"
                                    id="password_confirmation"
                                    value={passwordConfirmation}
                                    onChange={(e) =>
                                        setPasswordConfirmation(e.target.value)
                                    }
                                    className={`block w-full mt-1 ${
                                        errors.password_confirmation
                                            ? "border-red-500"
                                            : ""
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value > selectedUser?.amount) {
                                            setAmount(value);
                                        } else {
                                            Store.addNotification({
                                                title: "Invalid Amount!",
                                                message:
                                                    "Amount cannot be negative.",
                                                type: "warning",
                                                insert: "top",
                                                container: "top-right",
                                                animationIn: [
                                                    "animate__animated",
                                                    "animate__fadeIn",
                                                ],
                                                animationOut: [
                                                    "animate__animated",
                                                    "animate__fadeOut",
                                                ],
                                                dismiss: {
                                                    duration: 5000,
                                                    onScreen: true,
                                                },
                                            });
                                        }
                                    }}
                                    // disabled={selectedUser?.loan?.length === 0} // Disable input if loan array is empty
                                    className={`block w-full mt-1 ${
                                        errors.amount ? "border-red-500" : ""
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
                                // disabled={selectedUser?.loan?.length === 0} // Disable input if loan array is empty
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
