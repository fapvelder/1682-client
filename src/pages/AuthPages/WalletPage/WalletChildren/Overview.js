import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../../Store";
import { getAdminChart, getUserChart } from "../../../../api";
import MixChart from "../../../../component/Charts/MixChart";
export default function Overview() {
  const { state } = useContext(Store);
  const [data, setData] = useState([]);
  useEffect(() => {
    const getDataChart = async () => {
      const userID = state?.data?._id;
      const result = await getUserChart(userID);
      setData(result.data);
    };
    getDataChart();
  }, [state?.data?._id]);
  return <MixChart data={data} />;
}
