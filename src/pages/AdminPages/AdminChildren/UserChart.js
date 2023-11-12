import React, { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Store } from "../../../Store";
import { getAdminChart, getUserChart } from "../../../api";
import MixChart from "../../../component/Charts/MixChart";
export default function UserChart() {
  const { state } = useContext(Store);
  const [data, setData] = useState([]);
  useEffect(() => {
    const getDataChart = async () => {
      const result = await getAdminChart();
      // const result = await getUserChart(userID);
      setData(result.data);
    };
    getDataChart();
  }, []);

  return (
    <>
      <MixChart data={data} />
    </>
  );
}
