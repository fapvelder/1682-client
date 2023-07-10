import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  cancelOrder,
  completeOrder,
  feedbackOrder,
  getOrderDetails,
  getOrderItem,
  serverURL,
  transferItem,
  withdrawItem,
} from "../../../api";
import { Button, Checkbox, Input, Modal, Radio } from "antd";
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
import cancelled from "../../../component/img/cancelled.png";
import { Helmet } from "react-helmet-async";
import { Statistic } from "antd";
const { Countdown } = Statistic;
export default function OrderDetailsPage() {
  const { id } = useParams();
  const { state } = useContext(Store);
  const { loading, setLoading, reload, setReload } = useLoading();
  const navigate = useNavigate();
  const [order, setOrder] = useState("");
  const [feedback, setFeedback] = useState("");
  const [code, setCode] = useState("");
  const [tradeOffer, setTradeOffer] = useState("");
  const [rating, setRating] = useState("");
  const [ratingText, setRatingText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presentTime = Date.now();
  const deliveryTime =
    new Date(order?.createdAt).getTime() +
    24 * 1000 * order?.product?.deliveryIn;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCode("");
  };
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
  }, [id, reload]);

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
  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure to cancel the order?")) {
      const orderID = order?._id;
      const userID = state?.data?._id;
      handleLoading(
        async () => {
          await cancelOrder(orderID, userID);
          const socket = io(serverURL);
          socket.emit("send-notify", {
            userID: order?.seller?._id,
            type: "Cancel",
            url: `/order-details/${orderID}`,
          });
        },
        setLoading,
        setReload,
        "Order is cancelled"
      );
    }
  };
  const handleCompleteOrder = async () => {
    const orderID = order?._id;
    const userID = state?.data?._id;
    if (window.confirm("Are you sure to complete the order?")) {
      handleLoading(
        async () => {
          await completeOrder(orderID, userID);
          const socket = io(serverURL);
          socket.emit("send-notify", {
            userID: order?.seller?._id,
            type: "Complete",
            url: `/order-details/${orderID}`,
          });
        },
        setLoading,
        setReload,
        "Order is completed"
      );
    }
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
        const socket = io(serverURL);
        socket.emit("send-notify", {
          userID: order?.seller?._id,
          type: "Feedback",
          url: `/order-details/${orderID}`,
        });
      },
      setLoading,
      setReload,
      "Your feedback has been sent"
    );
  };
  const handleSendItem = async () => {
    const orderID = order?._id;
    const userID = state?.data?._id;
    handleLoading(
      async () => {
        await transferItem(
          userID,
          orderID,
          order?.product?.category?.name !== "Game Items" ? code : ""
        );
      },
      setLoading,
      setReload,
      "You have sent item successfully"
    );
  };
  return (
    <Grid container className="pb-50" style={{ padding: 10 }}>
      <Helmet>
        <title>Order Details</title>
      </Helmet>
      <Grid container>
        <Grid item md={6} style={{ paddingRight: 10 }}>
          <Grid container className="border" style={{ padding: 10 }}>
            <Grid item md={4}>
              <img
                style={{ width: 150, height: 150 }}
                src={order?.product?.photos?.[0]}
                alt=""
              />
            </Grid>
            <Grid item md={8} className="text-start">
              <p>{order?.product?.title}</p>
              <img
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
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
            <Grid container style={{ height: "100%" }}>
              <h3>Product Details</h3>
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
                    {order?.product?.deliveryMethod === "Bot"
                      ? "Bot Trade"
                      : order?.product?.deliveryMethod === "Auto"
                      ? "Digital Code"
                      : `Transfer`}{" "}
                  </Grid>
                </Grid>
                <Grid container className="detailsRow">
                  <Grid item md={4}>
                    Delivery in
                  </Grid>
                  {order?.product?.deliveryMethod === "Bot" ||
                  order?.product?.deliveryMethod === "Auto" ? (
                    <Grid item md={8}>
                      Auto delivery
                    </Grid>
                  ) : (
                    <Grid item md={8}>
                      {order?.product?.deliveryIn} day(s)
                    </Grid>
                  )}
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
                src={
                  order?.status === "Completed"
                    ? check
                    : order?.status === "Cancelled"
                    ? cancelled
                    : order?.status === "Pending" && pending
                }
                alt=""
                style={{ width: "150px", height: "150px" }}
              />
            </Grid>
            <Grid item md={8} className="text-start" style={{ fontSize: 22 }}>
              Transaction is {order?.status}
            </Grid>
          </Grid>
          {order?.product?.deliveryMethod === "Bot" ? (
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
          ) : order?.product?.deliveryMethod === "Auto" ? (
            <Grid container style={{ padding: 20, marginTop: 15 }}>
              <Grid item md={12} className="text-start">
                <h3>Key or Code</h3>
              </Grid>
              <Grid item md={12} className="border" style={{ padding: 10 }}>
                {order?.product?.digitalCode}
              </Grid>
            </Grid>
          ) : (
            order?.product?.deliveryMethod === "Transfer" &&
            (!order.isTransfer ? (
              <Grid container style={{ padding: 20, marginTop: 15 }}>
                {order.product.category.name === "Game Items" &&
                  order?.buyer?.profile?.steam?.steamTradeURL && (
                    <Grid item md={12} className="text-start">
                      <h3>Buyer Steam Trade Offer URL</h3>

                      <Input value={order.buyer.profile.steam.steamTradeURL} />
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <Button
                          className="defaultButton mt-15"
                          onClick={() =>
                            window.open(order.buyer.profile.steam.steamTradeURL)
                          }
                        >
                          Open it
                        </Button>
                      </div>
                    </Grid>
                  )}
                <Grid item md={12} className="text-start">
                  <h3>Wait for seller to send item</h3>
                </Grid>

                <Grid item md={12}>
                  <Countdown
                    title="Seller must send the item"
                    value={
                      new Date(order?.createdAt).getTime() +
                      24 * 60 * 60 * 1000 * order?.product?.deliveryIn
                    }
                  />

                  {order?.seller?._id === state?.data?._id &&
                  order?.product?.category.name === "Game Items" ? (
                    <Button
                      className="defaultButton"
                      onClick={() => handleSendItem()}
                    >
                      I have sent the item
                    </Button>
                  ) : (
                    order?.seller?._id === state?.data?._id &&
                    order?.product?.category.name !== "Game Items" && (
                      <Button
                        className="defaultButton"
                        onClick={() => showModal()}
                        // onClick={() => handleSendItem()}
                      >
                        Send Code
                      </Button>
                    )
                  )}
                </Grid>
              </Grid>
            ) : (
              <Grid container style={{ padding: 20, marginTop: 15 }}>
                <Grid item md={12} className="text-start">
                  <h3>Seller has sent the item</h3>
                </Grid>
                {order?.product?.category?.name !== "Game Items" ? (
                  <Grid item md={12} className="border" style={{ padding: 10 }}>
                    {order?.product?.digitalCode}
                  </Grid>
                ) : (
                  <Grid item md={12} className="border" style={{ padding: 10 }}>
                    Please check your trade offer
                  </Grid>
                )}
              </Grid>
            ))
          )}
          <Grid container style={{ padding: 20 }}>
            <h3>Order Details</h3>
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
                <div>{moment(order?.createdAt).fromNow()}</div>
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
                  disabled={rating === ""}
                  className="defaultButton mt-15"
                  onClick={() => handleFeedback()}
                >
                  Send Feedback
                </Button>
              </Grid>
            </Grid>
          )}
          {}
          {order?.status !== "Completed" &&
            state?.data?._id === order?.buyer?._id &&
            (presentTime >= deliveryTime ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <Button
                  className="defaultButton"
                  onClick={() => handleCancelOrder()}
                >
                  Cancel
                </Button>
                <Button
                  className="defaultButton"
                  onClick={() => handleCompleteOrder()}
                >
                  Complete
                </Button>
              </div>
            ) : (
              <div
                style={{ display: "flex", justifyContent: "end", padding: 20 }}
              >
                <Button
                  className="defaultButton"
                  onClick={() => handleCompleteOrder()}
                >
                  Complete
                </Button>
              </div>
            ))}
        </Grid>
      </Grid>
      <Modal
        title="Send the digital or key code"
        open={isModalOpen}
        onOk={() => handleSendItem()}
        onCancel={handleCancel}
      >
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
      </Modal>
    </Grid>
  );
}
