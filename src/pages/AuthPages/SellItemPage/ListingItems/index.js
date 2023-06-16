import { Grid } from "@material-ui/core";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useContext, useState } from "react";
import "./listingItems.css";
import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useLocation } from "react-router-dom";
import Schema from "async-validator";
import { createListing } from "../../../../api";
import { Store } from "../../../../Store";

const { Option } = Select;
export default function ListingItem() {
  const location = useLocation();
  const { state } = useContext(Store);
  const userID = state?.data?._id;
  const {
    url,
    title,
    description,
    category,
    subCategory,
    suggestedPrice,
    gameTitle,
  } = location.state;
  const [fileList, setFileList] = useState([]);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(
    description?.map((desc) => desc.value).join("\n")
  );
  const [digitalFee, setDigitalFee] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [finalIncome, setFinalIncome] = useState(0);
  const [price, setPrice] = useState(0);
  const [visibility, setVisibility] = useState("Public");
  const [deliveryIn, setDeliveryIn] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
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
      const parsedSuggestedPrice = parseFloat(suggestedPrice.replace("$", ""));
      // if (parsedSuggestedPrice && e > parsedSuggestedPrice * 1.5) {
      //   alert("Price cannot be more than 1.5 times the suggested price");
      // }

      setPrice(e);

      setDigitalFee((e * 0.02).toFixed(2));
      setCommissionFee((e * 0.08).toFixed(2));
      setFinalIncome((e - digitalFee - commissionFee).toFixed(2));
      console.log(price);
    }
  };
  const createListingItem = async () => {
    if (
      (userID,
      title,
      description,
      price,
      deliveryIn,
      deliveryMethod,
      category,
      subCategory,
      visibility,
      gameTitle,
      url)
    ) {
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
        gameTitle,
        url
      );
    }

    // console.log(url);
    // console.log(description);
    // console.log(deliveryMethod, delivery);
    // console.log(visibility);
    // console.log(title, category, subCategory);
    // console.log(gameTitle)
  };

  return (
    <Grid container className="pb-50">
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
                        border: "1px solid white",
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
                  value={editedTitle}
                  placeholder={title ? title : "Game title or listing title"}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <TextArea
                  value={editedDescription}
                  placeholder={
                    description
                      ? description
                      : "Item description or Listing details"
                  }
                  onChange={(e) => setEditedDescription(e.target.value)}
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
                  <Grid container className="bd-bt">
                    <Grid item md={4}>
                      Title
                    </Grid>
                    <Grid item md={7}>
                      {gameTitle}
                    </Grid>
                  </Grid>
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
                  <Radio value="Bot">
                    Automatic delivery via Bot (Deposit Item)
                  </Radio>

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
                      `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                  Gameflip. Unlisted listings can be seen and shared by anyone
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
              onClick={() => createListingItem()}
            >
              {" "}
              Done
            </Button>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
