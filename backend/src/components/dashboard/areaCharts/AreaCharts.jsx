import React from "react";
import AreaBarChart from "./AreaBarChart";
import AreaProgressChart from "./AreaProgressChart";

export default function AreaCharts() {
    return (
        <section className="content-area-charts">
            <AreaBarChart />
            <AreaProgressChart />
        </section>
    );
}
