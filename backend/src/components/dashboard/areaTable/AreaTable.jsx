import "./AreaTable.scss";
import { Pagination } from "../../../components";
import { MdAddCircleOutline } from "react-icons/md";

export default function AreaTable({
    text,
    title,
    records,
    tableHeads,
    currentPage,
    setCurrentPage,
    PageSize,
    searchQuery,
    setSearchQuery,
    isOpen,
    setIsOpen,
    children,
}) {
    return (
        <section className="content-area-table">
            <div className="data-table-info flex justify-between">
                <div className="flex items-center">
                    <h4 className="data-table-title uppercase">{title}</h4>
                    <div className="-mt-[5px] ml-12">
                        <label
                            htmlFor="search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="search"
                                className="block w-full px-8 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {text &&
                
                <div
                    onClick={() => isOpen(true)}
                    className="flex items-center bg-green-700 px-2 py-[2px] max-h-[35px] rounded text-sm mb-2 uppercase text-sky-200 font-bold cursor-pointer"
                >
                    <div className="flex items-center">
                        <MdAddCircleOutline className="mx-1" />
                        {text}
                    </div>
                </div>
                }
            </div>
            <div className="data-table-diagram">
                <table>
                    <thead>
                        <tr>
                            {tableHeads?.map((th, index) => (
                                <th key={index}>{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>{children}</tbody>
                </table>
            </div>
            <div className="pagination-controls flex gap-4 py-2">
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={records.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </section>
    );
}
