import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { AreaTable, AreaTop } from "../../components";
import { Tooltip } from "react-tooltip";
import AreaTableAction from "../../components/dashboard/areaTable/AreaTableAction";
import Loading from "../../components/Loading";
import { Store } from "react-notifications-component";
import { useForm } from "react-hook-form";
import Modal from "../../components/modal/Modal";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { format } from "date-fns";
import { CgSpinner } from "react-icons/cg";
import { LuBadgeCheck, LuBadgeX } from "react-icons/lu";

const TABLE_HEADS = [
    "№",
    "Order Name",
    "Created By",
    "Created At",
    "Created IP",
    "Active",
    "Action",
];

export default function Index() {
    const { PageSize } = useStateContext();
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusId, setStatusId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [color, setColor] = useState("#ff6");
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm();

    const fetchOrderStatus = async () => {
        setName("");
        setColor("");
        try {
            setLoading(true);
            const response = await axiosClient.get("/order-status");
            setOrderStatuses("");
            setOrderStatuses(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching Order Status");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderStatus();
    }, []);

    const handleAddOrEdit = async () => {
        clearErrors();
        const data = { name, color };
        try {
            setLoading(true);
            if (selectedStatus.id) {
                await axiosClient.put(
                    `/order-status/${selectedStatus.id}`,
                    data
                );
                Store.addNotification({
                    title: "Status Updated!",
                    message: "Status updated successfully!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: { duration: 5000, onScreen: true },
                });
                setLoading(false);
            } else {
                await axiosClient.post(`/order-status`, data);
                setLoading(true);
                Store.addNotification({
                    title: "New Status Added!",
                    message: "Status added successfully!",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: { duration: 5000, onScreen: true },
                });
            }
            setIsOpenUpdate(false);
            fetchOrderStatus();
            setLoading(false);
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

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/order-status/${id}`);
            Store.addNotification({
                title: "Status Deleted!",
                message: "Status deleted successfully!",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 5000, onScreen: true },
            });
            fetchOrderStatus();
        } catch (error) {
            console.error("Error deleting status:", error);
        }
    };

    useEffect(() => {
        if (selectedStatus && isOpenUpdate) {
            setName(selectedStatus.name);
            setSlug(selectedStatus.slug);
            setColor(selectedStatus.color);
        }
    }, [isOpenUpdate, selectedStatus]);

    const filteredRecords = useMemo(() => {
        return orderStatuses.filter((orderStatus) =>
            orderStatus.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, orderStatuses]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return filteredRecords.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredRecords, PageSize]);

    const updateActiveStatus = async (uuid, actived) => {
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("actived", actived);
        try {
            await axiosClient.post(`/status-actived/${uuid}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            fetchOrderStatus(); // Refresh data after update
            Store.addNotification({
                title: "Status Updated!",
                message: `Status ${
                    actived ? "activated" : "deactivated"
                } successfully!`,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 5000, onScreen: true },
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    let i = 1;

    return (
        <>
            <div className="content-area">
                <AreaTop text="Order Status" />
                <AreaTable
                    text="Create Status"
                    records={filteredRecords}
                    tableHeads={TABLE_HEADS}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    PageSize={PageSize}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isOpen={setIsOpenUpdate}
                    title="Order Status List"
                >
                    {currentTableData?.map((dataItem) => (
                        <tr key={dataItem.id}>
                            <th>#{i++}</th>
                            <td className="capitalize">
                                <div
                                    style={{
                                        backgroundColor: dataItem.color,
                                    }}
                                    className={`text-center px-2 py-1 rounded-sm bg-[${dataItem.color}]`}
                                >
                                    {dataItem.name}
                                </div>
                            </td>
                            <td>
                                {dataItem.admin_name === "Super"
                                    ? "System"
                                    : dataItem.admin_name}
                            </td>
                            <td>
                                {format(
                                    new Date(dataItem.created_at),
                                    "dd-MM-yyyy"
                                )}
                            </td>
                            <td>{dataItem.ip_address}</td>
                            <td>
                            {dataItem.actived == 0 ? (
                                            <div
                                                className="text-emerald-600 cursor-pointer"
                                                onClick={() =>
                                                    updateActiveStatus(dataItem.uuid, 1)
                                                } // Activate
                                            >
                                                <LuBadgeCheck size={24} />
                                            </div>
                                        ) : (
                                            <div
                                                className="text-red-600 cursor-pointer"
                                                onClick={() =>
                                                    updateActiveStatus(dataItem.uuid, 0)
                                                } // Deactivate
                                            >
                                                <LuBadgeX size={24} />
                                            </div>
                                        )}
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
                                            data-tooltip-content="Edit Status"
                                            className="dropdown-menu-link"
                                            onClick={() => {
                                                setStatusId(dataItem.id || "");
                                                setSelectedStatus(dataItem);
                                                setIsOpenUpdate(true);
                                            }}
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
                                            data-tooltip-content="Delete Status"
                                            className="dropdown-menu-link"
                                            onClick={() =>
                                                handleDelete(dataItem.id)
                                            }
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

            {isOpenUpdate && (
                <Modal
                    isOpen={isOpenUpdate}
                    closeModal={() => setIsOpenUpdate(false)}
                    setIsOpen={setIsOpenUpdate}
                    onClose={() => setIsOpenUpdate(false)}
                    onRequestClose={() => setIsOpenUpdate(false)}
                    title={
                        selectedStatus?.id ? "Update Status" : "Add New Status"
                    }
                >
                    <div className="py-4">
                        <form onSubmit={handleSubmit(handleAddOrEdit)}>
                        <div className="my-2">
                        <div className="frm_grp">

                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    {...register("name", {
                                        required: true,
                                    })}
                                    onChange={(e) => setName(e.target.value)}
                                    className=
                                    {`block w-full mt-1 ${
                                        errors.color ? "border-red-500" : ""
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

                            <div className="my-2">
                                <div className="frm_grp">
                                    <label
                                        htmlFor="color"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Status Color
                                    </label>
                                    <input
                                        id="color"
                                        name="color"
                                        type="color"
                                        value={color}
                                        {...register("color", {
                                            required: true,
                                        })}
                                        onChange={(e) =>
                                            setColor(e.target.value)
                                        }
                                    className=
                                    {`block w-full mt-1 ${
                                        errors.color ? "border-red-500" : ""
                                    }`}
                                    />
                                </div>
                            </div>
                            <div className="error-sms">
                                {errors.color && (
                                    <span className=" text-red-500 ">
                                        {errors.color.message}
                                    </span>
                                )}
                            </div>
                            <div className="btn_wrap flex justify-end mt-4">
                            <button
                                className="btn"
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? (
                                    <CgSpinner className="animate-spin" />
                                ) : selectedStatus ? (
                                    "Update Status"
                                ) : (
                                    "Add Status"
                                )}
                            </button>
                            </div>

                        </form>
                    </div>
                </Modal>
            )}
        </>
    );
}
