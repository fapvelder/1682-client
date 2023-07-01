import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import "./productDetails.css";
import { Button, Divider, Input } from "antd";
import img from "../../../component/img/movie.jpg";
import UserDetails from "../../../component/UserDetails";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import {
  createComment,
  getProductComments,
  getProductDetails,
} from "../../../api";
import moment from "moment";
import { Store } from "../../../Store";
import handleLoading from "../../../component/HandleLoading";
import useLoading from "../../../component/HandleLoading/useLoading.js";
import Loading from "../../../component/Loading/index.js";
export default function ProductDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { loading, setLoading, reload, setReload } = useLoading();
  const [product, setProduct] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const userID = state?.data?._id;
  const id = params?.productID;
  useEffect(() => {
    const getDetails = async () => {
      const result = await getProductDetails(id);
      setProduct(result.data);
    };
    const getComments = async () => {
      const result = await getProductComments(id);
      console.log(result.data);
      setComments(result.data);
    };
    getComments();
    getDetails();
  }, [id]);
  const handleComment = async () => {
    if (userID && id && comment) {
      handleLoading(
        async () => {
          await createComment(userID, id, comment);
        },
        setLoading,
        setReload,
        "Comment successfully"
      );
    }
  };
  const handleBuy = () => {
    navigate(`/checkout/${id}`);
  };

  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>{product?.title}</title>
      </Helmet>
      {loading && <Loading />}
      <Grid container className="generalContainer">
        <Grid item md={6}>
          <div className="general">
            <Grid container className="text-start ml-15">
              <Grid item md={12}>
                <p>{product.title}</p>
              </Grid>
              <Grid item md={12}>
                <p>
                  {product?.category?.name} / {product?.platform?.name}
                </p>
              </Grid>
              <Divider />
            </Grid>
            <Grid container>
              <img src={product?.photos?.[0]} alt="" />
            </Grid>
          </div>
        </Grid>
        <Grid item md={6}>
          <div className="specific">
            <Grid container className="priceItem">
              <span>
                <p>Digital Code</p>
                <p>{moment(product?.createdAt).fromNow()}</p>
              </span>
              <span>${product?.price} USD</span>
            </Grid>
            <Grid container className="buyBtn">
              {product?.listingBy?._id !== state?.data?._id ? (
                <Button className="defaultButton" onClick={() => handleBuy()}>
                  Buy
                </Button>
              ) : (
                <Button className="defaultButton">Edit</Button>
              )}
            </Grid>
            <Grid container>
              {Array.isArray(product?.description) ? (
                product?.description?.map((item, index) => (
                  <div key={index} className="itemDesc text-start">
                    {item.value.split("\n").map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                  </div>
                ))
              ) : (
                <div className="itemDesc text-start">{product.description}</div>
              )}
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
                    You're protected under the GameBay Guarantee. Get the item
                    as described or your money back.
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid container style={{ display: "flex", justifyContent: "end" }}>
              <Button className="defaultButton reportBtn">
                <i className="fas fa-flag" />
                &nbsp; Report
              </Button>
            </Grid>
            <Grid container>
              <div className="commentContainer text-start">
                <Grid container>Comments</Grid>
                <Grid container>
                  Caution: Comments are written by the marketplace users.
                  GameBay will never write comments on listings.
                </Grid>

                <Grid container>
                  {comments?.map((comment) => (
                    <div className="listComments">
                      <Grid container>
                        <Grid item md={3}>
                          <div
                            className="imageComment"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/profile/${comment.commenter.slug}`)
                            }
                          >
                            <img src={comment.commenter.avatar} alt="" />
                          </div>
                        </Grid>
                        <Grid item md={9}>
                          <div className="text-start">
                            <p
                              style={{ cursor: "pointer", color: "orange" }}
                              onClick={() =>
                                navigate(`/profile/${comment.commenter.slug}`)
                              }
                            >
                              {comment.commenter?.displayName ||
                                comment.commenter?.fullName}
                            </p>
                            <p>{comment.comment}</p>
                            <p>
                              {moment(comment.createdAt).format("MMM YYYY")}
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                  <div className="comment">
                    <Input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment"
                    />
                    <Button onClick={() => handleComment()}>Send</Button>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
