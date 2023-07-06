import React, { useContext, useEffect, useState } from "react";
import { getOrders } from "../../../api";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import completed from "../../../component/img/completed.png";
import { Tabs } from "antd";

const { TabPane } = Tabs;

export default function PurchasePage() {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    const getAllOrders = async () => {
      const result = await getOrders();
      setPurchases(
        result?.data?.filter(
          (purchase) => purchase?.buyer._id === state?.data?._id
        )
      );
    };
    getAllOrders();
  }, [state?.data?._id]);

  const handleTabChange = (key) => {
    setSelectedStatus(key);
  };

  const filteredPurchases =
    selectedStatus === "All"
      ? purchases
      : purchases.filter((purchase) => purchase.status === selectedStatus);

  const colorStatus = {
    Pending: "orange",
    Cancelled: "black",
    Completed: "green",
  };
  return (
    <Grid container className="mg-auto-80" style={{ paddingBottom: "50vh" }}>
      <Helmet>
        <title>Purchases</title>
      </Helmet>
      <Grid container className="border mt-15" style={{ padding: 20 }}>
        <Tabs
          style={{ width: "100%" }}
          activeKey={selectedStatus}
          onChange={handleTabChange}
        >
          <TabPane tab="All" key="All" />
          <TabPane tab="Completed" key="Completed" />
          <TabPane tab="Pending" key="Pending" />
          <TabPane tab="Cancelled" key="Cancelled" />
        </Tabs>
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <Grid
              container
              className="border"
              style={{ padding: "10px 0 10px 50px" }}
              key={purchase._id}
            >
              <div
                className="backgroundProduct-100"
                style={{
                  marginRight: 10,
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => navigate(`/order-details/${purchase._id}`)}
              >
                <img
                  style={{ width: 100, height: 100 }}
                  src={purchase.product.photos[0]}
                  alt=""
                />
                {purchase.status === "Completed" && (
                  <img
                    src={completed}
                    style={{
                      width: 80,
                      height: 80,
                      position: "absolute",
                      top: -5,
                      left: -5,
                    }}
                    alt=""
                  />
                )}
              </div>
              <div className="text-start" style={{ marginRight: 50 }}>
                <div>
                  <div>{purchase?.product?.title}</div>
                  <div style={{ color: colorStatus[purchase?.status] }}>
                    {purchase?.status}
                  </div>
                  <div>${purchase?.product?.price} USD</div>
                  <div>Bought from {moment(purchase?.createdAt).fromNow()}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => navigate(`/profile/${purchase.seller.slug}`)}
              >
                <span style={{ marginRight: "5px" }}>Sold by:</span>
                <p
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    margin: "0",
                  }}
                >
                  {purchase.seller.displayName || purchase.seller.fullName}
                </p>
              </div>
            </Grid>
          ))
        ) : (
          <div>You have no purchases yet</div>
        )}
      </Grid>
    </Grid>
  );
}
