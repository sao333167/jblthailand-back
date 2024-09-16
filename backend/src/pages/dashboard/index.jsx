import React from "react";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";

export default function index() {
    return (
        <div className="content-area">
            <AreaTop text="Dashboard"/>
            <AreaCards />
            <AreaCharts />
        </div>
    );
}
