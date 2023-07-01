import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  completeOrder,
  feedbackOrder,
  getOrderDetails,
  getOrderItem,
  withdrawItem,
} from "../../../api";
import { Button, Checkbox, Input, Radio } from "antd";
import moment from "moment";
import { Store } from "../../../Store";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading";
import { io } from "socket.io-client";
import TextArea from "antd/es/input/TextArea";
import good from "../../../component/img/good.png";
import neutral from "../../../component/img/neutral.png";
import bad from "../../../component/img/bad.png";
import check from "../../../component/img/check.png";
import pending from "../../../component/img/pending.png";
export default function OrderDetailsPage() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const { loading, setLoading, reload, setReload } = useLoading();
  const navigate = useNavigate();
  const [order, setOrder] = useState("");
  const [feedback, setFeedback] = useState("");
  const [tradeOffer, setTradeOffer] = useState("");
  const [rating, setRating] = useState("");
  const [ratingText, setRatingText] = useState("");
  const feedbackRating = [
    {
      rating: "Good",
      src: good,
      ratingText: "Thank you for your positive feedback!",
    },
    {
      rating: "Neutral",
      src: neutral,
      ratingText: "Thank you for your feedback.",
    },
    {
      rating: "Bad",
      src: bad,
      ratingText:
        "We apologize for any inconvenience. Please provide more details about your experience.",
    },
  ];
  useEffect(() => {
    const getOrder = async () => {
      const result = await getOrderDetails(id);
      setOrder(result.data);
    };
    getOrder();
  }, [id]);

  useEffect(() => {
    const socket = io();
    // Listen for the 'tradeOfferStatus' event
    socket.on("tradeOfferURL", (data) => {
      if (data.tradeOfferURL) {
        window.open(data.tradeOfferURL);
      }
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCompleteOrder = async () => {
    const orderID = order?._id;
    const userID = state?.data?._id;
    handleLoading(
      async () => {
        await completeOrder(orderID, userID);
      },
      setLoading,
      setReload,
      "Order is completed"
    );
  };
  const handleTrade = async () => {
    const orderID = order?._id;
    const userID = order?.seller?._id;
    const receiverID = order?.buyer?._id;
    const appID = order?.product?.item?.appid;
    const version = order?.product?.item?.contextid;
    const classID = order?.product?.item?.classID;
    handleLoading(
      async () => {
        await getOrderItem(
          orderID,
          userID,
          receiverID,
          appID,
          version,
          classID
        );
      },
      setLoading,
      setReload,
      "Trade offer has been accepted"
    );
  };
  const handleFeedback = () => {
    const orderID = order?._id;
    const userID = state?.data?._id;

    handleLoading(
      async () => {
        await feedbackOrder(orderID, feedback, rating);
      },
      setLoading,
      setReload,
      "Your feedback has been sent"
    );
  };
  return (
    <Grid container className="pb-50" style={{ padding: 10 }}>
      <Grid container>
        <Grid item md={6} style={{ paddingRight: 10 }}>
          <Grid container className="border" style={{ padding: 10 }}>
            <Grid item md={4}>
              <img src={order?.product?.photos?.[0]} alt="" />
            </Grid>
            <Grid item md={8} className="text-start">
              <p>{order?.product?.title}</p>
              <img
                style={{ borderRadius: "50%", cursor: "pointer" }}
                onClick={() => navigate(`/profile/${order?.seller?.slug}`)}
                src={order?.seller?.avatar}
                alt=""
              />
              <span style={{ margin: "0px 10px" }}>Sold by:</span>
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  margin: "0",
                }}
                onClick={() => navigate(`/profile/${order?.seller?.slug}`)}
              >
                {order?.seller?.displayName || order?.seller?.fullName}
              </span>
            </Grid>
          </Grid>
          <Grid container className="border mt-15" style={{ padding: 20 }}>
            <Grid container>
              <div className="specificDetails text-start">
                <Grid container className=" detailsRow">
                  <Grid item md={4}>
                    Category
                  </Grid>
                  <Grid item md={8}>
                    {order?.product?.category?.name}
                  </Grid>
                </Grid>
                <Grid container className="detailsRow">
                  <Grid item md={4}>
                    Title
                  </Grid>
                  <Grid item md={8}>
                    {order?.product?.gameTitle}
                  </Grid>
                </Grid>

                <Grid container className="detailsRow">
                  <Grid item md={4}>
                    Delivery method
                  </Grid>
                  <Grid item md={8}>
                    {order?.product?.deliveryIn} day(s)
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
                    You're protected under the GameBay Guarantee. Get the item
                    as described or your money back.
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} className="border " style={{ position: "relative" }}>
          <Grid container style={{ height: 150, padding: 20 }}>
            <Grid item md={4}>
              <img
                src={order?.status === "Completed" ? check : pending}
                alt=""
                style={{ width: "150px", height: "150px" }}
              />
            </Grid>
            <Grid item md={8} className="text-start" style={{ fontSize: 22 }}>
              Transaction is {order?.status}
            </Grid>
          </Grid>
          <Grid container style={{ padding: 20, marginTop: 15 }}>
            <Grid item md={12} className="text-start">
              <h3>Start bot trade</h3>
            </Grid>
            <Grid
              item
              md={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {!order?.isBotSent ? (
                <Button
                  style={{ height: 50 }}
                  onClick={() => handleTrade()}
                  className="defaultButton"
                >
                  Click here to start bot trade
                </Button>
              ) : (
                <div style={{ height: 50 }}>
                  You has accepted the trade offer.
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container style={{ padding: 20 }}>
            <Grid item md={12} className="border text-start">
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>OrderID</div>
                <div>{order?._id}</div>
              </Grid>
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>Date</div>
                <div>{moment(order?.createdAt).format("MMM DD, YYYY")}</div>
              </Grid>
              <Grid
                container
                className="detailsRow"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>Price</div>
                <div>{order?.product?.price}</div>
              </Grid>
            </Grid>
          </Grid>
          {order?.status === "Completed" && !order.isFeedback && (
            <Grid container style={{ padding: 20 }}>
              <Grid
                container
                style={{ display: "flex", justifyContent: "center" }}
              >
                <p>Please help us rating how was his/her service</p>
              </Grid>
              <Grid
                container
                style={{ display: "flex", justifyContent: "space-evenly" }}
              >
                {feedbackRating?.map((fb) => (
                  <div
                    onClick={() => {
                      setRatingText(fb.ratingText);
                      setRating(fb.rating);
                    }}
                  >
                    <img
                      style={{ width: 50, height: 50 }}
                      src={fb.src}
                      alt={fb.rating}
                    />
                  </div>
                ))}
                {ratingText && (
                  <Grid
                    container
                    className="mt-15"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <p>{ratingText}</p>
                  </Grid>
                )}
                {/* <Radio.Group className="mt-15" onChange={handleRadioChange}>
                  <div style={{ display: "flex", columnGap: 30 }}>
                    <span>
                      <div>
                        <img
                          style={{ width: 50, height: 50 }}
                          src={bad}
                          alt="bad"
                        />
                      </div>
                      <Radio value="Bad">Bad</Radio>
                    </span>
                    <span>
                      <div>
                        <img
                          style={{ width: 50, height: 50 }}
                          src={neutral}
                          alt="neutral"
                        />
                      </div>

                      <Radio value="Neutral">Neutral</Radio>
                    </span>
                    <span>
                      <div>
                        <img
                          style={{ width: 50, height: 50 }}
                          src={good}
                          alt="good"
                        />
                      </div>

                      <Radio value="Good">Good</Radio>
                    </span>
                  </div>
                </Radio.Group> */}
              </Grid>
              <Grid container className="mt-15">
                <p>Give us feedback about the seller:</p>
              </Grid>
              <TextArea
                autoSize={{ minRows: 5, maxRows: 5 }}
                onChange={(e) => setFeedback(e.target.value)}
                value={feedback}
                placeholder="Optional feedback"
              />

              <Grid
                container
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Button
                  disabled={feedback === ""}
                  className="defaultButton mt-15"
                  onClick={() => handleFeedback()}
                >
                  Send Feedback
                </Button>
              </Grid>
            </Grid>
          )}
          {order?.status !== "Completed" && (
            <Button
              style={{
                position: "absolute",
                right: 20,
                bottom: 20,
              }}
              className="defaultButton"
              onClick={() => handleCompleteOrder()}
            >
              Complete
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
