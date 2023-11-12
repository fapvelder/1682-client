import React from "react";
import ReactApexChart from "react-apexcharts";

export default function MixChart({ data }) {
  const transformedData = data.map((entry) => ({
    date: new Date(entry._id.year, entry._id.month - 1, entry._id.day), // Months are zero-based in JavaScript Date
    quantitySold: entry.itemCount, // Quantity sold
    totalRevenue: entry.totalPrice, // Total revenue
  }));
  const chart = {
    series: [
      {
        name: "Quantity sold",
        type: "column",
        data: transformedData.map((entry) => ({
          x: entry.date,
          y: entry.quantitySold,
        })),
      },
      {
        name: "Revenue",
        type: "line",
        data: transformedData.map((entry) => ({
          x: entry.date,
          y: entry.totalRevenue,
        })),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Sales Overview",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: transformedData.map((entry) => entry.x),
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Quantity",
          },
        },
        {
          opposite: true,
          title: {
            text: "USD",
          },
        },
      ],
    },
  };
  const calculateTotalRevenue = (data) => {
    return data.reduce((total, entry) => total + entry.totalPrice, 0);
  };
  const calculateQuantitySold = (data) => {
    return data.reduce((total, entry) => total + entry.itemCount, 0);
  };
  return (
    <>
      <div style={{ textAlign: "center", margin: "20px" }}>
        <h2>
          Total Revenue (Last 3 Months): ${" "}
          {calculateTotalRevenue(data).toFixed(2)}
        </h2>
        <h2>
          Total Item Sold (Last 3 Months): {calculateQuantitySold(data)} Items
        </h2>
      </div>
      <div id="chart">
        <ReactApexChart
          options={chart.options}
          series={chart.series}
          type="line"
          height={350}
        />
      </div>
    </>
  );
}
