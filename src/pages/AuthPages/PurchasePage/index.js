import React, { useContext, useEffect, useState } from "react";
import { getOrders } from "../../../api";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { useNavigate } from "react-router-dom";
export default function PurchasePage() {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  useEffect(() => {
    const getAllOrders = async () => {
      const result = await getOrders();
      setPurchases(
        result?.data?.filter(
          (purchase) => purchase?.buyer._id === state?.data?._id
        )
      );
      console.log(result?.data);
    };
    getAllOrders();
  }, []);
  return (
    <Grid container className="mg-auto-80">
      <Helmet>
        <title>Purchases</title>
      </Helmet>
      {console.log(purchases)}
      <Grid container className="border mt-15" style={{ padding: 10 }}>
        {purchases?.map((purchase) => (
          <Grid
            container
            className="border"
            style={{ padding: "10px 0 10px 50px" }}
          >
            <div style={{ marginRight: 10 }}>
              <img
                style={{ width: 100, height: 100 }}
                src={purchase.product.photos[0]}
                alt=""
              />
            </div>
            <div className="text-start" style={{ marginRight: 50 }}>
              <div>
                <div>{purchase?.product?.title}</div>
                <div>{purchase?.status}</div>
                <div>${purchase?.product?.price}USD</div>
                <div>
                  Bought from {moment(purchase?.createdAt).format("MMM YYYY")}
                </div>
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
        ))}
      </Grid>
    </Grid>
  );
}
