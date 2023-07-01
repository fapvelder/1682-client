import { Grid } from "@material-ui/core";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Steps,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useEffect, useState } from "react";
import "./listingItems.css";
import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Schema from "async-validator";
import { checkOfferStatus, createListing, depositItem } from "../../../../api";
import { Store } from "../../../../Store";
import handleLoading from "../../../../component/HandleLoading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import Loading from "../../../../component/Loading";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
export default function ListingItem() {
  const location = useLocation();
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const { loading, setLoading, reload, setReload } = useLoading();
  const userID = state?.data?._id;
  const [item, setItem] = useState("");
  const [url, setURL] = useState("");
  const [photos, setPhotos] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  useEffect(() => {
    if (location?.state) {
      let state = location?.state;
      setItem(state.item);
      setURL(state.url);
      setTitle(state.title || "");
      setDescription(
        Array.isArray(state.description)
          ? state?.description?.map((desc) => desc?.value).join("\n")
          : state?.description || ""
      );
      setCategory(state.category);
      setSubCategory(state.subCategory);
      setSuggestedPrice(state.suggestedPrice);
      setGameTitle(state.gameTitle);
    }
  }, [location?.state]);
  const [fileList, setFileList] = useState([]);
  const [digitalFee, setDigitalFee] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [finalIncome, setFinalIncome] = useState(0);
  const [price, setPrice] = useState(0);
  const [visibility, setVisibility] = useState("Public");
  const [deliveryIn, setDeliveryIn] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [tradeOffer, setTradeOffer] = useState("");
  const [id, setID] = useState("");
  const [completeTrade, setCompleteTrade] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState(0);
  const [current, setCurrent] = useState(0);
  const showModalCode = () => {
    setDeliveryIn("");
    setIsModalOpen(true);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setDeliveryIn("Auto");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  useEffect(() => {
    if (completeTrade) {
      setDeliveryIn("Auto");
    }
  }, [completeTrade]);
  useEffect(() => {
    if (fileList) {
      setTimeout(() => setPhotos(fileList?.map((file) => file.thumbUrl)), 100);
    }
  }, [fileList]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const checkPrice = (e) => {
    if (e) {
      setPrice(e);
      setDigitalFee((e * 0.02).toFixed(2));
      setCommissionFee((e * 0.08).toFixed(2));
      setFinalIncome((e - digitalFee - commissionFee).toFixed(2));
    }
  };
  const handleDepositItem = async () => {
    const appID = item?.appid;
    const version = item?.contextid;
    const classID = item?.classID;
    handleLoading(
      async () => {
        const response = await depositItem(userID, appID, version, classID);
        setTradeOffer(response.data.tradeOfferUrl);
        setID(response.data.id);
        setCurrent(1);
      },
      setLoading,
      setReload,
      "Trade offer has been sent"
    );
  };

  const handleComplete = async () => {
    handleLoading(
      async () => {
        const offerID = tradeOffer?.split("/")[4];
        const response = await checkOfferStatus(offerID);
        if (response.data.message === "ACCEPTED") {
          setCompleteTrade(true);
          setDeliveryIn("auto");
        }
        setCurrent(2);
      },
      setLoading,
      setReload,
      "Trade offer has been completed"
    );
  };
  const checkToContinue = () => {
    return (
      userID === "" ||
      title === "" ||
      description === "" ||
      price === 0 ||
      deliveryIn === "" ||
      deliveryMethod === "" ||
      category === "" ||
      subCategory === "" ||
      visibility === "" ||
      (url ? url === "" : photos.length === 0)
    );
  };

  const createListingItem = async () => {
    const hasSufficientElements =
      userID &&
      title &&
      description &&
      price >= 1 &&
      deliveryIn &&
      deliveryMethod &&
      category &&
      subCategory &&
      visibility;
    if (hasSufficientElements) {
      handleLoading(
        async () => {
          await createListing(
            userID,
            title,
            description,
            price,
            deliveryIn,
            deliveryMethod,
            category,
            subCategory,
            visibility,
            gameTitle ? gameTitle : "",
            url ? url : photos,
            deliveryMethod === "Bot" && completeTrade ? item : "", // item
            deliveryMethod === "Auto" ? code : "" // code
          );
          setCompleteTrade(false);
          setItem("");
          setDeliveryMethod("");
          setCurrent(0);
          navigate("/");
        },
        setLoading,
        setReload,
        "Product listing successfully"
      );
    }
  };

  return (
    <Grid container className="pb-50">
      {loading && <Loading />}
      <div className="mg-auto-80 mt-15">
        <Grid container className="mg-auto-80 selectCustom">
          <Grid container className="customSection">
            <h3>
              <span>Screenshots / Photos</span>
            </h3>
            <Grid container>
              <div style={{ padding: 10 }}>
                <p>
                  Your screenshots should clearly show what you are selling.
                  640x640 is recommended.
                </p>
                {url ? (
                  <div className="item-background">
                    <img
                      style={{
                        width: 160,
                        height: 160,
                      }}
                      src={url}
                      alt=""
                    />
                  </div>
                ) : (
                  <div>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
                      beforeUpload={() => false}
                      showUploadList={{
                        showPreviewIcon: false,
                      }}
                    >
                      {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Description</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <p>
                  The listing title and description must be accurate and as
                  informative as possible (no random or lottery-like listing).
                  Misleading description is a violation of our terms of service.
                </p>
                <Input
                  value={title}
                  placeholder={title ? title : "Game title or listing title"}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <TextArea
                  value={description}
                  placeholder={
                    description
                      ? description
                      : "Item description or Listing details"
                  }
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ marginTop: 10 }}
                  autoSize={{ minRows: 6, maxRows: 10 }}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Category</span>
            </h3>
            <Grid container style={{ padding: 15 }}>
              <Grid item md={8}>
                <Grid
                  container
                  className="category"
                  style={{ gridGap: "10px", padding: "15px" }}
                >
                  {gameTitle && (
                    <Grid container className="bd-bt">
                      <Grid item md={4}>
                        Title
                      </Grid>
                      <Grid item md={7}>
                        {gameTitle}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container className="bd-bt">
                    <Grid item md={4}>
                      Category
                    </Grid>
                    <Grid item md={7}>
                      {category}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={4}>
                      Platform
                    </Grid>
                    <Grid item md={7}>
                      {subCategory}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Delivery Method</span>
            </h3>
            <Grid container>
              <Radio.Group
                onChange={(e) => setDeliveryMethod(e.target.value)}
                // value={deliveryMethod}
                style={{ padding: 15 }}
              >
                <Space direction="vertical">
                  {category === "Game Items" ? (
                    <Radio value="Bot" onClick={showModal}>
                      Automatic delivery via Bot{" "}
                    </Radio>
                  ) : (
                    <Radio value="Auto" onClick={showModalCode}>
                      Automatic delivery
                    </Radio>
                  )}

                  <Radio value="Transfer" style={{ marginTop: 20 }}>
                    I will coordinate with buyer to transfer.
                  </Radio>
                  {deliveryMethod === "Transfer" && (
                    <Radio.Group
                      style={{ padding: 25 }}
                      onChange={(e) => setDeliveryIn(e.target.value)}
                    >
                      <Space direction="vertical">
                        <Radio value="1">1 days</Radio>
                        <Radio value="2">2 days</Radio>
                        <Radio value="3">3 days</Radio>
                      </Space>
                    </Radio.Group>
                  )}
                </Space>
              </Radio.Group>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Price</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                {suggestedPrice && <p>Suggested Price: {suggestedPrice} </p>}
                <Form.Item>
                  <InputNumber
                    defaultValue={0}
                    formatter={(value) =>
                      `$ ${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                    max={2000}
                    onChange={(e) => checkPrice(e)}
                  />
                </Form.Item>

                <p>Our marketplace is for items priced between $1 and $2500</p>
                <p>Compare to similar listings</p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Visibility</span>
            </h3>
            <Grid container>
              <div style={{ padding: 15 }}>
                <Select
                  defaultValue="Public"
                  onChange={(e) => setVisibility(e)}
                  style={{ width: "20%" }}
                >
                  <Option value="Public">Public</Option>
                  <Option value="Unlisted">Unlisted</Option>
                </Select>
                <p>
                  Public listings can be seen and searched by anyone using
                  GameBay. Unlisted listings can be seen and shared by anyone
                  with the link.
                </p>
              </div>
            </Grid>
          </Grid>
          <Grid container className="customSection">
            <h3>
              <span>Estimate Fees & Proceeds</span>
            </h3>
            <Grid container style={{ padding: 15 }}>
              <Grid container>
                <Grid item md={4}>
                  Digital transfer fee:
                </Grid>
                <Grid item md={8}>
                  {digitalFee ? `$${digitalFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  Commission fee:
                </Grid>
                <Grid item md={8}>
                  {commissionFee ? `$${commissionFee} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={4}>
                  You make:
                </Grid>
                <Grid item md={8}>
                  {finalIncome ? `$${finalIncome} USD` : "$0.00 USD"}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container style={{ display: "flex", justifyContent: "end" }}>
            <Button
              className="defaultButton"
              disabled={checkToContinue()}
              onClick={() => createListingItem()}
            >
              {" "}
              Done
            </Button>
          </Grid>
        </Grid>
      </div>
      {category === "Game Items" ? (
        <Modal
          title="Deposit item to Bot"
          open={isModalOpen}
          // onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          height={500}
          footer={
            current === 0
              ? [
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button key="back" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleDepositItem()}
                      className="defaultButton"
                    >
                      Start Bot Trade
                    </Button>
                  </div>,
                ]
              : current === 1 &&
                tradeOffer && [
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      className="defaultButton"
                      onClick={() => handleComplete()}
                    >
                      I've completed Bot Trade
                    </Button>
                    <Button
                      className="defaultButton"
                      onClick={() => window.open(tradeOffer)}
                    >
                      See trade offer
                    </Button>
                  </div>,
                ]
          }
        >
          {current === 0 ? (
            <div>
              <div>
                Our GameBay Bot will hold your item and deliver to buyer when
                your listing is sold. When you click Start, a GameBay bot will
                send you a trade offer in Steam using your Steam Trade URL. The
                trade offer is automatically cancelled if you do not accept
                within 5 minutes.
              </div>
              <br />
              <div>
                You must be logged in Steam and have your Steam Guard Mobile
                ready for trading.
              </div>
              <div>Having problems to deposit your item?</div>
              <Button
                className="defaultButton"
                onClick={() => window.open("https://steamstat.us/")}
              >
                Check the current Steam status.
              </Button>
            </div>
          ) : current === 1 ? (
            <div>
              <div>
                Please verify that the bot trade offer references the following
                Listing ID
              </div>
              <center>{id}</center>
              <div>
                Once you successfully traded with GameBay Steam bot, please
                confirm below.
              </div>
            </div>
          ) : (
            current === 2 && <div>Thank you for depositing item</div>
          )}
          {/* <div onClick={() => handleDepositItem()}>Deposit Item</div> */}
          <Steps
            style={{ marginTop: 15 }}
            labelPlacement="vertical"
            current={current}
            items={[
              {
                title: "Start Bot Trade",
              },
              {
                title: "Accept Bot Trade In Steam",
                icon: current === 1 && <LoadingOutlined />,
              },
              {
                title: "Complete Bot Trade",
              },
            ]}
          />
        </Modal>
      ) : (
        <Modal
          title="Provide digital or key code"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          height={500}
        >
          <Grid container>
            <TextArea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the redemption code"
              style={{ marginTop: 10 }}
              autoSize={{ minRows: 6, maxRows: 10 }}
            ></TextArea>
            <div>
              Important:
              <p>
                Be sure to enter the correct code or card number and PIN. Buyer
                will request refund if card cannot be redeemed.
              </p>
            </div>
          </Grid>
        </Modal>
      )}
    </Grid>
  );
}
