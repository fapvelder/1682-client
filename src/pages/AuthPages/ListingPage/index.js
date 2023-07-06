import React, { useContext, useEffect, useState } from "react";
import { getMyProducts, getOrders } from "../../../api";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "./listingPage.css";
import completed from "../../../component/img/completed.png";
import soldBanner from "../../../component/img/sold.png";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const statusOptions = ["All", "Completed", "Sold", "On Sale"]; // Available status options

export default function ListingsPage() {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All"); // Default selected status

  useEffect(() => {
    const getAllOrders = async () => {
      const result = await getOrders();
      setListings(
        result?.data?.filter(
          (listing) => listing?.seller._id === state?.data?._id
        )
      );
    };
    getAllOrders();
  }, [state?.data?._id]);

  useEffect(() => {
    const getAllProducts = async () => {
      const result = await getMyProducts(state?.data?._id);
      setProducts(result.data);
    };
    getAllProducts();
  }, [state?.data?._id]);

  const handleStatusChange = (key) => {
    setSelectedStatus(key);
  };

  const filteredProducts =
    selectedStatus === "All"
      ? products
      : products.filter((product) => product.status === selectedStatus);

  const colorStatus = {
    "On Sale": "orange",
    Sold: "blue",
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
          onChange={handleStatusChange}
        >
          {statusOptions.map((status, index) => (
            <TabPane tab={status} key={status} />
          ))}
        </Tabs>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const listing = listings.find(
              (listing) => listing.product._id === product._id
            );

            return (
              <Grid
                container
                className="border"
                style={{ padding: "10px 0 10px 50px" }}
                key={product._id}
              >
                <div
                  className="backgroundProduct-100"
                  style={{
                    marginRight: 10,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      listing?.status === "Completed" ||
                        listing?.status === "Pending"
                        ? `/order-details/${listing._id}`
                        : `/item/${product._id}`
                    )
                  }
                >
                  <img
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    src={product.photos[0]}
                    alt=""
                  />

                  {product.status === "Completed" && (
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
                  {product.status === "Sold" && (
                    <img
                      src={soldBanner}
                      style={{
                        width: 80,
                        height: 80,
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                      alt=""
                    />
                  )}
                </div>
                <div className="text-start" style={{ marginRight: 50 }}>
                  <div>
                    <div>{product.title}</div>
                    <div style={{ color: colorStatus[product.status] }}>
                      {product.status}
                    </div>
                    <div>${product.price} USD</div>
                    <div>Bought from {moment(product.createdAt).fromNow()}</div>
                  </div>
                </div>
                {listing && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>Sold by:</span>
                    <p
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        margin: "0",
                      }}
                    >
                      {product.listingBy.displayName ||
                        product.listingBy.fullName}
                    </p>
                  </div>
                )}
              </Grid>
            );
          })
        ) : (
          <Grid container>No Products</Grid>
        )}
      </Grid>
    </Grid>
  );
}
