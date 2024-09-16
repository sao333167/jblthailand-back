import React, { useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { PiSignatureFill } from "react-icons/pi";
import { FaAddressCard } from "react-icons/fa";
import { IoCard } from "react-icons/io5";
import { FaFemale } from "react-icons/fa";
import { FaMale } from "react-icons/fa";

export default function detial() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getUserDetail, getUser, documentIds, signatures } = useStateContext();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { uuid } = useParams();
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getUserDetail(uuid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);
    return (
        <div className="bg-gray-100 capitalize">
            <div className="w-full text-white bg-main-color">
                <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
                    <div className="p-4 flex flex-row items-center justify-between">
                        <a
                            href="#"
                            className="text-lg font-semibold tracking-widest uppercase rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            customer profile
                        </a>
                        <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                className="w-6 h-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* <!-- End of Navbar --> */}

            <div className="container mx-auto my-5 p-5">
                <div className="md:flex no-wrap md:-mx-2 ">
                    {/* <!-- Left Side --> */}
                    <div className="w-full md:w-3/12 md:mx-2">
                        {/* <!-- Profile Card --> */}
                        <div
                            className={`bg-white p-3 border-t-4 ${
                                getUser.suspended == 0
                                    ? "border-green-500 "
                                    : " border-red-500"
                            }`}
                        >
                            <div className="image overflow-hidden">
                                <img
                                    className="h-auto w-full mx-auto"
                                    src={`${
                                        import.meta.env.VITE_API_BASE_ADMIN_URL
                                    }/storage/customer/${documentIds[0]?.full}`}
                                    alt=""
                                />
                            </div>
                            <h1 className="text-gray-900 font-bold text-xl leading-8 my-1 uppercase">
                                user : {getUser.name}
                            </h1>
                            <h3 className="text-gray-600 font-lg text-semibold capitalize leading-6">
                                Company :{" "}
                                {getUser.company_name ? (
                                    getUser.company_name
                                ) : (
                                    <span className="animate-ping text-red-300 ml-3">
                                        incomplete
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Reprehenderit, eligendi
                                dolorum sequi illum qui unde aspernatur non
                                deserunt
                            </p>
                            <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                                <li className="flex items-center py-3">
                                    <span>Status</span>
                                    <span className="ml-auto">
                                        <span
                                            className={`
                                            ${
                                                getUser.suspended == 0
                                                    ? "bg-green-500 "
                                                    : " bg-red-500"
                                            }
                                             py-1 px-3 rounded text-white text-[11px]`}
                                        >
                                            {getUser.suspended == 0
                                                ? "Active"
                                                : "Unactive"}
                                        </span>
                                    </span>
                                </li>
                                <li className="flex items-center py-3">
                                    <span>Member since</span>
                                    <span className="ml-auto text-[11px] text-gray-400">
                                        {getUser.created_at}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- End of profile card --> */}
                        <div className="my-4"></div>
                        {/* <!-- Friends card --> */}
                        <div className="bg-white p-3 hover:shadow h-">
                            <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8"></div>
                        </div>
                        {/* <!-- End of friends card --> */}
                    </div>
                    {/* <!-- Right Side --> */}
                    <div className="w-full md:w-9/12 mx-2 h-64">
                        {/* <!-- Profile tab --> */}
                        {/* <!-- About Section --> */}
                        <div className="bg-white p-3 shadow-sm rounded-sm">
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                <span className="text-green-500">
                                    <svg
                                        className="h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </span>
                                <span className="tracking-wide">About</span>
                            </div>
                            <div className="text-gray-700">
                                <div className="grid md:grid-cols-2 text-sm">
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            real name
                                        </div>
                                        <div className="px-4 py-2">
                                            {documentIds[0]?.name ? (
                                                documentIds[0]?.name
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Last Name
                                        </div>
                                        <div className="px-4 py-2">Doe</div>
                                    </div> */}
                                     

                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Gender
                                        </div>
                                        <div className="px-4 py-2">
                                            {getUser.gender ? (
                                                getUser.gender
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                            {getUser.gender == "male" ? (
                                                <FaMale />
                                            ) : getUser.gender == "female" ? (
                                                <FaFemale />
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Contact No.
                                        </div>
                                        <div className="px-4 py-2">
                                            +63 {getUser.tel}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Current Address
                                        </div>
                                        <div className="px-4 py-2 text-wrap">
                                            {getUser.address ? (
                                                getUser.address
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            National Id Name.
                                        </div>
                                        <div className="px-4 py-2">
                                            <div className="text-blue-800 capitalize">
                                                {documentIds[0]?.name ? (
                                                documentIds[0]?.name
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            National Id Number.
                                        </div>
                                        <div className="px-4 py-2">
                                            <a className="text-blue-800">
                                                {documentIds[0]?.id_number ? (
                                                documentIds[0]?.id_number
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Birthday
                                        </div>
                                        <div className="px-4 py-2">
                                            {getUser.birthday ? (
                                                getUser.birthday
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Emergency Contact.
                                        </div>
                                        <div className="px-4 py-2">
                                            {getUser.emergency_contact ? (
                                                getUser.emergency_contact
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Emergency Contact Name.
                                        </div>
                                        <div className="px-4 py-2">
                                            {getUser.emergency_contact_name ? (
                                                getUser.emergency_contact_name
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-2 font-semibold">
                                            Emergency Relaitvity.
                                        </div>
                                        <div className="px-4 py-2">
                                            {getUser.emergency_contact_relativity ? (
                                                getUser.emergency_contact_relativity
                                            ) : (
                                                <span className="animate-ping text-red-300 ml-3">
                                                    incomplete
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                                Show Full Information
                            </button>
                        </div>
                        {/* <!-- End of about section --> */}

                        <div className="my-4"></div>

                        {/* <!-- Experience and education --> */}
                        <div className="bg-white p-3 shadow-sm rounded-sm">
                            <div className="grid grid-cols-3 space-x-2">
                                <div>
                                    {/* front id card */}
                                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                        <span className="text-green-500">
                                            <FaAddressCard />
                                        </span>
                                        <span className="tracking-wide">
                                            Front Id Card
                                        </span>
                                    </div>
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <img
                                            className="h-auto min-h-[155px] w-full mx-auto max-w-[50%]"
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_ADMIN_URL
                                            }/storage/customer/${
                                                documentIds[0]?.front
                                            }`}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    {/* back id card */}
                                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                        <span className="text-green-500">
                                            <IoCard />
                                        </span>
                                        <span className="tracking-wide">
                                            Back Id Card
                                        </span>
                                    </div>
                                    <div className="space-y-2 p-4 border rounded-md">
                                        <img
                                            className="h-auto min-h-[155px] w-full mx-auto max-w-[50%]"
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_ADMIN_URL
                                            }/storage/customer/${
                                                documentIds[0]?.back
                                            }`}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div>
                                    {/* signatures */}
                                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                        <span className="text-green-500">
                                            <PiSignatureFill />
                                        </span>
                                        <span className="tracking-wide">
                                            Signatures
                                        </span>
                                    </div>
                                    <div className="space-y-2 p-4 border rounde-md">
                                        <img
                                            className="h-auto min-h-[155px] w-full mx-auto max-w-[50%]"
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_ADMIN_URL
                                            }/storage/signature/${
                                                signatures[0]?.sign
                                            }`}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <!-- End of Experience and education grid --> */}
                        </div>
                        {/* <!-- End of profile tab --> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
