import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../axios";
import { useForm } from "react-hook-form";
import { Store } from "react-notifications-component";

const StateContext = createContext({
    user: null,
    token: null,
    notification: null,
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

// eslint-disable-next-line react/prop-types
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [notification, _setNotification] = useState("");
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    // const [token, _setToken] = useState(123);

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const [status, setStatus] = useState(0);

    const [documentIds, setDocumentIds] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showMessage, setShowMessage] = useState("");
    const [showMessageStatus, setShowMessageStatus] = useState("");
    const [userRole, setUserRole] = useState("");
    const [durations, setDurations] = useState([]);
    const [isOpenBank, setIsOpenBank] = useState(false);
    const [isOpenIdentify, setIsOpenIdentify] = useState(false);
    const [isOpenScore, setIsOpenScore] = useState(false);
    const [isOpenWallet, setIsOpenWallet] = useState(false);
    const [isOpenPass, setIsOpenPass] = useState(false);
    const [isOpenWithdrawCode, setIsOpenWithdrawCode] = useState(false);
    const [withdrawCode, setWithdrawCode] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [bankName, setBankName] = useState("");
    const [name, setName] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [getAmount, setGetAmount] = useState("");
    const [remake, setRemake] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();

    let PageSize = 10;

    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
    });

    const setNotification = (message) => {
        _setNotification(message);
        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    // =============== Get Profile ===============
    const getProfile = async () => {
        setLoading(true);
        await axiosClient.get(`/profile`).then(({ data }) => {
            setUser(data);
            setUserRole(data?.roles?.name);
            setLoading(false);
        });
    };
    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, []);
    // ===============End Get Profile ===============
    // =============== Staff Role Permission ===============
    const getSystemSetting = async (url) => {
        url = url || "/systemsettings";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                setRecords(data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };

    // =============== getDuration ===============
    const getDurations = async (url) => {
        url = url || "/durations";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                setRecords(data);
                setDurations(data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };
    // =============== Staff Role Permission ===============
    const getStaffs = async (url) => {
        url = url || "/admins";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                setRecords(data.data);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };
    const [getAllRoles, setGetAllRoles] = useState([]);
    const getRoles = async (url) => {
        url = url || "/roles";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                setRecords(data.data);
                setGetAllRoles(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const [showPermission, setShowPermission] = useState();
    const getPermissions = async (url) => {
        url = url || "/permissions";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                setRecords(data.data);
                setLoading(false);
                setShowPermission(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    // =============== End Staff ===============
    // =============== Customer ===============
    const getUsers = async (url) => {
        url = url || "/users";
        setLoading(true);
        await axiosClient
            .get(url)
            .then(({ data }) => {
                // console.log(data.data)
                setLoading(false);
                setRecords(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    const [getUser, setGetUser] = useState([]);

    const getUserDetail = async (id) => {
        setLoading(true);
        await axiosClient
            .get(`/users/` + id)
            .then(({ data }) => {
                setName(data.document_id[0]?.name);
                setIdNumber(data.document_id[0]?.id_number);
                setGetUser(data.user);
                setAmount(data.user?.amount);
                setGetAmount(data.user?.amount);
                setBankAccount(data.user?.bank[0]?.bank_acc);
                setBankName(data.user?.bank[0]?.bank_name);
                setDocumentIds(data.document_id);
                setSignatures(data.signatures);
                setWithdrawCode(data.user?.loan[0]?.loan_withdraw_code);
            })
            .catch((err) => {
                console.log(err);
            });
        setLoading(false);
    };

    // =============== End Customer ===============

    const [picture, setPicture] = useState([]);
    const [imageurl, setimageurl] = useState();

    const handleImageChange = (e) => {
        setPicture({ image: e.target.files[0] });
        setimageurl(URL.createObjectURL(e.target.files[0]));
    };

    // =============== Get Agent Winloss ===============

    const handleThisWeek = async () => {
        let curr = new Date();
        let dates = [];

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i;
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            dates.push(day);
        }

        const formData = new FormData();
        formData.append("datefrom", dates[0]);
        formData.append("dateto", dates[6]);
        setLoading(true);
        await axiosClient.post(`/getwinloss`, formData).then(({ data }) => {
            setRecords(data[0]);
            setLoading(false);
        });
    };
    const handleLastWeek = async () => {
        let curr = new Date(); // get current date
        let first = curr.getDate() - curr.getDay();
        first = first - 6;
        let firstdayOb = new Date(curr.setDate(first));
        let firstday = firstdayOb.toUTCString();

        let firstdayTemp = firstdayOb;

        let lastday = new Date(
            firstdayTemp.setDate(firstdayTemp.getDate() + 6)
        ).toUTCString();

        const formData = new FormData();
        formData.append("datefrom", firstday);
        formData.append("dateto", lastday);
        setLoading(true);
        await axiosClient.post(`/getwinloss`, formData).then(({ data }) => {
            setRecords(data[0]);
            setLoading(false);
        });
    };

    const [unreadLoans, setUnreadLoans] = useState([]);
    const fetchUnreadLoans = async () => {
        try {
            const response = await axiosClient.get("/loans-unread");
            setUnreadLoans(response.data);
        } catch (error) {
            console.error("Error fetching unread loans:", error);
        }
    };

    const handleUpdateBank = async (userId, bankName, bankAccount) => {
        clearErrors();
        try {
            setBtnLoading(true);
            await axiosClient.put(`/update-bank/${userId}`, {
                bank_name: bankName,
                bank_acc: bankAccount,
            });
            Store.addNotification({
                title: "Update Bank.!",
                message: "Bank information is updated!",
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
            setBtnLoading(false);
            setIsOpenBank(false);
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

    const handleIdentify = async (userUuId, name, idNumber) => {
        clearErrors();
        try {
            setBtnLoading(true);
            await axiosClient.put(`/update-identify/${userUuId}`, {
                name: name,
                id_number: idNumber,
            });

            Store.addNotification({
                title: "Update Identify.!",
                message: "Identify information is updated!",
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
            setBtnLoading(false);
            setIsOpenIdentify(false);
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

    const handleScore = async (userUuId, score) => {
        clearErrors();

        try {
            setBtnLoading(true);
            await axiosClient.put(`/update-score/${userUuId}`, {
                score: score,
            });
            Store.addNotification({
                title: "Update Score.!",
                message: "Score is updated!",
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

            setBtnLoading(false);
            setIsOpenScore(false);
            getUsers();
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

    const handleUpdateCode = async (loanUuId, withdrawCode) => {
        clearErrors();
        try {
            setBtnLoading(true);
            await axiosClient.put(
                `/update-withdraw-code/${loanUuId}`,

                {
                    withdraw_code: withdrawCode,
                }
            );
            Store.addNotification({
                title: "Update Withdraw Code.!",
                message: "Withdraw Code is updated!",
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
            setBtnLoading(false);
            setIsOpenWithdrawCode(false);
            getUsers();
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

    const handlePassword = async (
        userUuId,
        username,
        password,
        passwordConfirmation
    ) => {
        clearErrors();

        try {
            setBtnLoading(true);
            await axiosClient.put(`/update-pass/${userUuId}`, {
                username: username,
                password: password,
                password_confirmation: passwordConfirmation,
            });
            Store.addNotification({
                title: "Update Password.!",
                message: "Password is updated!",
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
            setBtnLoading(false);
            setIsOpenPass(false);
            getUsers();
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

    const handleAmount = async (
        amount,
        userId,
        userUuId,
        getAmount,
        remake
    ) => {
        clearErrors();
        try {
            setBtnLoading(true);
            const response = await axiosClient.post(`/transactions`, {
                amount: amount,
                user_id: userId,
                customer_uuid: userUuId,
                before_amount: getAmount,
                remake: remake,
            });
            console.log(response.data); // Ensure this is not empty

            Store.addNotification({
                title: "Update Amount.!",
                message: "Amount is updated!",
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
            setBtnLoading(false);
            setIsOpenWallet(false);
            getUsers();
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

    const onLogout = () => {
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
            window.location.reload();
        });
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
                getUsers,
                getUserDetail,
                getUser,
                loading,
                records,
                setLoading,
                status,
                setStatus,
                getStaffs,
                getRoles,
                getAllRoles,
                getPermissions,
                showPermission,
                handleImageChange,
                setPicture,
                picture,
                setimageurl,
                imageurl,
                handleThisWeek,
                handleLastWeek,
                getProfile,
                PageSize,
                documentIds,
                signatures,
                onLogout,
                showAlert,
                setShowAlert,
                showMessage,
                setShowMessage,
                setShowMessageStatus,
                showMessageStatus,
                userRole,
                getSystemSetting,
                fetchUnreadLoans,
                unreadLoans,
                getDurations,
                durations,
                handleUpdateBank,
                isOpenBank,
                setIsOpenBank,
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
                setWithdrawCode,
                withdrawCode,
                setBankAccount,
                bankAccount,
                setBankName,
                bankName,
                setName,
                name,
                setIdNumber,
                idNumber,
                amount,
                setAmount,
                getAmount,
                setRemake,
                remake,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
