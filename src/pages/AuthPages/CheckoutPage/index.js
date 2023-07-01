import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { getProductDetails, placeOrder } from "../../../api";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import UserDetails from "../../../component/UserDetails";
import { Store } from "../../../Store";
import { Button } from "antd";
import "./checkout.css";
import useLoading from "../../../component/HandleLoading/useLoading";
import Loading from "../../../component/Loading";
import { toast } from "react-toastify";
import handleLoading from "../../../component/HandleLoading";
import io from "socket.io-client";

export default function CheckoutPage() {
  const params = useParams();
  const { state } = useContext(Store);
  const [product, setProduct] = useState("");
  const id = params?.id;
  const userID = state?.data?._id;
  const { loading, setLoading, reload, setReload } = useLoading();
  useEffect(() => {
    const getDetails = async () => {
      const result = await getProductDetails(id);
      setProduct(result.data);
    };
    getDetails();
  }, [id]);
  const placeOrderProduct = () => {
    if (userID !== product?.listingBy?._id) {
      handleLoading(
        async () => {
          const socket = io("http://localhost:5000");
          await placeOrder(userID, product?._id);
          socket.emit("send-notify", {
            userID: product?.listingBy?._id,
            message: "Purchase product",
          });
        },
        setLoading,
        setReload,
        "Place order successfully"
      );
    } else {
      toast.error("Cannot place order your own product");
    }
  };
  return (
    <Grid container style={{ padding: 10 }}>
      <Helmet>
        <title> {"Checkout " + product?.title}</title>
      </Helmet>
      {loading && <Loading />}

      <Grid item md={6}>
        <h3>Checkout</h3>
        <Grid container className="border">
          <Grid
            item
            md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <div className="background-item">
              <img
                style={{ width: 170, height: 170 }}
                src={product?.photos?.[0]}
                alt=""
              />
            </div>
          </Grid>
          <Grid
            item
            md={8}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="text-start">
              <p>{product?.title}</p>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <UserDetails
            currentChatUser={product?.listingBy}
            contact={
              product?.listingBy?._id === state?.data?._id ? false : true
            }
            width={"100%"}
          />
        </Grid>

        <Grid container>
          <div className="specificDetails text-start">
            <Grid container className=" detailsRow">
              <Grid item md={4}>
                Category
              </Grid>
              <Grid item md={8}>
                {product?.category?.name}
              </Grid>
            </Grid>
            <Grid container className="detailsRow">
              <Grid item md={4}>
                Title
              </Grid>
              <Grid item md={8}>
                {product?.gameTitle}
              </Grid>
            </Grid>

            <Grid container className="detailsRow">
              <Grid item md={4}>
                Delivery method
              </Grid>
              <Grid item md={8}>
                {product?.deliveryIn} day(s)
              </Grid>
            </Grid>
            <Grid container className="detailsRow">
              <Grid item md={4}>
                Region restriction
              </Grid>
              <Grid item md={8}>
                Europe
              </Grid>
            </Grid>
            <Grid container className="detailsRow">
              <Grid item md={4}>
                Returns
              </Grid>
              <Grid item md={8}>
                No return. View our return policy
              </Grid>
            </Grid>
            <Grid container className="detailsRow">
              <Grid item md={4}>
                Accept currency
              </Grid>
              <Grid item md={8}>
                USD
              </Grid>
            </Grid>
            <Grid container className="detailsRow">
              <Grid item md={4}>
                Protection
              </Grid>
              <Grid item md={8}>
                You're protected under the GameBay Guarantee. Get the item as
                described or your money back.
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid item md={6} style={{ paddingLeft: 10 }}>
        <h3>Order</h3>
        <Grid container className="border" style={{ padding: 10 }}>
          <h6>Wallet</h6>
          <Grid
            container
            className="border"
            style={{
              padding: 10,
            }}
          >
            <Grid item md={2}>
              Cash Balance
            </Grid>
            <Grid
              item
              md={10}
              style={{ display: "flex", justifyContent: "end" }}
            >
              {state?.data?.wallet.toFixed(2)}
            </Grid>
          </Grid>
          <h6 className="mt-15">Order</h6>
          <Grid container className="border text-start">
            <Grid
              container
              className="detailsRow"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Grid item md={11}>
                Price
              </Grid>
              <Grid item md={1}>
                {product?.price}
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Grid item md={10}>
                Balance after purchasing
              </Grid>
              <Grid item md={1}>
                {state?.data?.wallet.toFixed(2) - product?.price}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="mt-15">
            <div className="placeOrderBtn ">
              <Button
                className="defaultButton"
                onClick={() => placeOrderProduct()}
              >
                Place Order
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
