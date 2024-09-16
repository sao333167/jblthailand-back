import React from "react";
import { useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios";
import { CgSpinner } from "react-icons/cg";

export default function login() {
    const [errors, setErrors] = useState(null);
    const { setUser, setToken, setLoading, loading } = useStateContext();

    const phoneRef = useRef();
    const passwordRef = useRef();

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const payload = {
            phone: phoneRef.current.value,
            password: passwordRef.current.value,
        };

        // setErrors(null);

        // console.log(payload);
        setLoading(true);
        await axiosClient
            .post("/login", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors);
                    } else {
                        setErrors({
                            phone: [response.data.message],
                        });
                    }
                }
            });
        setLoading(false);
    };

    return (
        <section className="border-red-500 bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 p-5 flex rounded-2xl shadow-lg max-w-3xl">
                <div className="md:w-1/2 px-5">
                    <h2 className="text-2xl font-bold text-[#002D74]">Login</h2>
                    <form className="mt-6" onSubmit={onSubmit}>
                        {errors && (
                            <div className="intro-x alert bg-theme-6 ">
                                <div className="px-5"></div>
                                <div className="px-5">
                                    {Object.keys(errors).map((key) => (
                                        <p key={key}>{errors[key][0]}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700">Phone</label>
                            <input
                                ref={phoneRef}
                                type="number"
                                name="phone"
                                placeholder="Phone"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700">
                                Password
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                minLength="6"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="text-right mt-2">
                            <a
                                href="#"
                                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                px-4 py-3 mt-6"
                        >
                            <div className="flex justify-center items-center ">
                                {loading && (
                                    <CgSpinner className="animate-spin -ml-2" />
                                )}
                                Log In
                            </div>
                        </button>
                    </form>

                    <div className="mt-7 grid grid-cols-3 items-center text-gray-500">
                        <hr className="border-gray-500" />
                        <p className="text-center text-sm">OR</p>
                        <hr className="border-gray-500" />
                    </div>

                    <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 ">
                        <span className="ml-4">Contact Supporter</span>
                    </button>
                </div>

                <div className="w-1/2 md:block hidden ">
                    <img
                        src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                        className="rounded-2xl"
                        alt="page img"
                    />
                </div>
            </div>
        </section>
    );
}
