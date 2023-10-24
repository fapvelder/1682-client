import { Grid } from "@material-ui/core";
import { Button, Checkbox, Collapse, Input, InputNumber } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BsFillCartPlusFill, BsFillCartXFill } from "react-icons/bs";
import CSItem from "../../../component/CSItem";
import { SettingOutlined } from "@ant-design/icons";
import "./tradepage.css";
import en from "../../../component/languages/en.json";
import vi from "../../../component/languages/vi.json";
import { Store } from "../../../Store";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { getItemInventory, serverURL, tradeCSGO } from "../../../api";
import axios from "axios";
import handleLoading from "../../../component/HandleLoading";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const { Panel } = Collapse;
export default function TradeItemsPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const [language, setLanguage] = useState("en");
  const [add, setAdd] = useState(false);
  const [filter, setFilter] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [expandIconPosition, setExpandIconPosition] = useState("start");
  const [userItems, setUserItems] = useState([]);
  const [adminItems, setAdminItems] = useState([]);
  const [userOffer, setUserOffer] = useState([]);
  const [adminOffer, setAdminOffer] = useState([]);
  const userID = state?.data?._id;
  const balance = state?.data?.wallet;
  const onPositionChange = (newExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };
  const onChange = (key) => {
    console.log(key);
  };
  const onAddToOffer = (item) => {
    console.log(item);
  };
  const handleCSItemUserClick = (item) => {
    const itemIndex = userOffer.findIndex(
      (offerItem) => offerItem.classid === item.classid
    );
    if (itemIndex === -1) {
      setUserOffer([...userOffer, item]);
    } else {
      const updatedOffer = userOffer.filter(
        (offerItem) => offerItem.classid !== item.classid
      );
      setUserOffer(updatedOffer);
    }
  };
  const handleCSItemAdminClick = (item) => {
    const itemIndex = adminOffer.findIndex(
      (offerItem) => offerItem.classid === item.classid
    );
    if (itemIndex === -1) {
      setAdminOffer([...adminOffer, item]);
    } else {
      const updatedOffer = adminOffer.filter(
        (offerItem) => offerItem.classid !== item.classid
      );
      setAdminOffer(updatedOffer);
    }
  };

  useEffect(() => {
    const setItems = async () => {
      if (state?.data?.tradeItem) {
        const url =
          "https://community.cloudflare.steamstatic.com/economy/image/";
        const requestsUser = state?.data?.tradeItem?.user?.descriptions
          ?.filter((item) => item.tradable === 1)
          ?.map((item) =>
            axios.get(
              `https://gameflip.com/api/v1/steam/price/730/${item.market_hash_name}`
            )
          );
        const requestsAdmin = state?.data?.tradeItem?.admin?.descriptions
          ?.filter((item) => item.tradable === 1)
          ?.map((item) =>
            axios.get(
              `https://gameflip.com/api/v1/steam/price/730/${item.market_hash_name}`
            )
          );
        const responsesUser = await axios?.all(requestsUser);
        const responsesAdmin = await axios?.all(requestsAdmin);
        const priceUser = responsesUser?.map(
          (response) => response?.data?.data?.median_price
        );
        const priceAdmin = responsesAdmin?.map(
          (response) => response?.data?.data?.median_price
        );

        setUserItems(
          state?.data?.tradeItem?.user?.descriptions
            ?.filter((item, index) => item.tradable === 1)
            .map((item, index) => ({
              appid: item.appid,
              classid: item.classid,
              assetid: item.assetid,
              photo: url + item.icon_url,
              action: item?.market_actions?.[0].link,
              market_hash_name: item.market_hash_name,
              tags: item.tags,
              price: priceUser[index] ? priceUser[index] : "No suggested price",
            }))
        );

        setAdminItems(
          state?.data?.tradeItem?.admin?.descriptions
            ?.filter((item) => item.tradable === 1)
            .map((item, index) => {
              let priceValue = parseFloat(priceAdmin[index]?.replace("$", ""));
              if (!isNaN(priceValue)) {
                priceValue += priceValue * 0.05;
                priceAdmin[index] = `$${priceValue.toFixed(2)}`;
              } else {
                priceAdmin[index] = "No suggested price";
              }
              return {
                appid: item.appid,
                classid: item.classid,
                assetid: item.assetid,
                photo: url + item.icon_url,
                action: item?.market_actions?.[0].link,
                market_hash_name: item.market_hash_name,
                tags: item.tags,
                price: priceAdmin[index]
                  ? priceAdmin[index]
                  : "No suggested price",
              };
            })
        );
      }
    };
    setItems();
  }, [state?.data?.tradeItem]);
  useEffect(() => {
    const getPrice = () => {
      let total = userOffer
        ?.reduce((accumulator, item) => {
          const price = parseFloat(item.price.replace("$", ""));
          return accumulator + price;
        }, 0)
        .toFixed(2);
      setTotalUser(total);
    };
    getPrice();
  }, [userOffer]);
  useEffect(() => {
    const getPrice = () => {
      let total = adminOffer
        ?.reduce((accumulator, item) => {
          const price = parseFloat(item.price.replace("$", ""));
          return accumulator + price;
        }, 0)
        .toFixed(2);
      setTotalAdmin(total);
    };
    getPrice();
  }, [adminOffer]);
  useEffect(() => {
    const socket = io(serverURL);
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
  useEffect(() => {
    const socket = io(serverURL);
    socket.on("tradeOfferStatus", (data) => {
      if (data) {
        const { code, message } = data;
        if (code === 0) {
          toast.success(message);
        }
        if (code === 1) {
          toast.error(message);
        }
      }
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleCheckboxChange = (tag) => {
    if (filter.includes(tag)) {
      setFilter(filter.filter((item) => item !== tag));
    } else {
      setFilter([...filter, tag]);
    }
  };
  console.log(filter);
  const getItems = async () => {
    await getItemInventory(userID);
  };
  const trade = async () => {
    await tradeCSGO(
      userID,
      730,
      2,
      adminOffer,
      userOffer,
      totalAdmin,
      totalUser
    );
  };

  return (
    <Grid container>
      <Helmet>
        <title>Trade Items</title>
      </Helmet>
      <Grid
        container
        style={{
          paddingTop: 15,
          border: "1px solid black",
          height: "95vh",
          width: "100%",
        }}
      >
        <Grid item md={5} lg={5} className="you-offer">
          <Grid container style={{ gridGap: "5px" }}>
            <Grid container style={{ gridGap: "5px" }}>
              <Collapse
                defaultActiveKey={["1"]}
                onChange={onChange}
                style={{ width: "100%" }}
              >
                <Panel
                  header={
                    <div className="custom-panel-header">
                      <div>You offer</div>
                      <div>$ {totalUser}</div>
                    </div>
                  }
                  key="1"
                >
                  {userOffer.length > 0 ? (
                    <Grid container className="offer" style={{ gridGap: 10 }}>
                      {userOffer?.map((item) => (
                        <CSItem
                          item={item}
                          width={18}
                          image={item.photo}
                          exterior={"FT"}
                          // float="0.2596"
                          price={item.price}
                          onButtonClick={handleCSItemUserClick}
                          display={false}
                          height={100}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <p className="item-choose text">What you are offering</p>
                  )}
                </Panel>
              </Collapse>
            </Grid>
            <Grid container className="border radius">
              <Grid
                container
                className=""
                style={{
                  height: 50,
                  padding: 13,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="inputGroup search-inventory">
                  <Input
                    className="customInputAntd"
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    placeholder={language === "en" ? en.search : vi.search}
                    style={{ width: "90%" }}
                    // onKeyDown={handleKeyDown}
                  />
                  <div className="inputGroupAppendSearch">
                    <button
                      className="borderRight"
                      // onClick={() => handleSearch()}
                    >
                      <i className="fas fa-search" />
                    </button>
                  </div>
                </div>
                <div
                  className="spin"
                  style={{ cursor: "pointer" }}
                  onClick={() => getItems()}
                >
                  <ReloadOutlined />
                </div>
              </Grid>
              <Grid
                container
                className="inventory-trade"
                style={{ gridGap: 10 }}
              >
                {userItems?.map((item) => (
                  <CSItem
                    item={item}
                    width={23}
                    image={item.photo}
                    exterior={"FT"}
                    // float="0.2596"
                    price={item.price}
                    onButtonClick={handleCSItemUserClick}
                  />
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={2} lg={2} className="item-filter">
          <Grid
            container
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              style={{
                width: "80%",
                padding: "0px 10px",
                borderRadius: "5px",
              }}
              className="border"
            >
              <Grid item md={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    opacity: 0.5,
                  }}
                >
                  Balance
                </div>
                <div style={{ display: "flex", justifyContent: "start" }}>
                  $ {balance?.toFixed(2)}
                </div>
              </Grid>
              <Grid
                item
                md={4}
                style={{ display: "flex", justifyContent: "end" }}
              >
                <PlusCircleOutlined
                  style={{
                    fontSize: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/wallet")}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
            }}
          >
            <Button
              className="defaultButton"
              style={{ width: "80%" }}
              onClick={() => trade()}
            >
              Trade
            </Button>
          </Grid>
          <Grid
            container
            style={{
              paddingTop: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Collapse
              defaultActiveKey={["1"]}
              onChange={onChange}
              style={{ width: "80%" }}
              expandIconPosition={"end"}
              expandIcon={({ isActive }) =>
                isActive ? <PlusOutlined /> : <MinusOutlined />
              }
            >
              <Panel header={<div className="text">Price</div>} key="1">
                <InputNumber style={{ width: "45%" }} /> -{" "}
                <InputNumber style={{ width: "45%" }} />
              </Panel>
            </Collapse>
          </Grid>
          <Grid
            container
            style={{
              paddingTop: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Collapse
              defaultActiveKey={["1"]}
              onChange={onChange}
              style={{ width: "80%" }}
              expandIconPosition={"end"}
              expandIcon={({ isActive }) =>
                isActive ? <PlusOutlined /> : <MinusOutlined />
              }
            >
              <Panel
                className="text"
                header={<div className="text">Type</div>}
                key="1"
              >
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Knife")}
                  >
                    Knives
                  </Checkbox>
                </div>
                <div className="display-start ">
                  {" "}
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Glove")}
                  >
                    Gloves
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Pistol")}
                  >
                    Pistols
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("SMG")}
                  >
                    SMGs
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Rifle")}
                  >
                    Assault Rifles
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Sniper Rifle")}
                  >
                    Sniper Rifles
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Shotgun")}
                  >
                    Shotguns
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Machinegun")}
                  >
                    Machine guns
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Key")}
                  >
                    Keys
                  </Checkbox>
                </div>
              </Panel>
            </Collapse>
          </Grid>
          <Grid
            container
            style={{
              paddingTop: 10,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Collapse
              defaultActiveKey={["1"]}
              onChange={onChange}
              style={{ width: "80%" }}
              expandIconPosition={"end"}
              expandIcon={({ isActive }) =>
                isActive ? <PlusOutlined /> : <MinusOutlined />
              }
            >
              <Panel header={<div className="text">Exterior</div>} key="1">
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Factory New")}
                  >
                    Factory New
                  </Checkbox>
                </div>
                <div className="display-start">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Minimal Wear")}
                  >
                    Minimal Wear
                  </Checkbox>
                </div>
                <div className="display-start">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Field-Tested")}
                  >
                    Field-Tested
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Well Worn")}
                  >
                    Well-Worn
                  </Checkbox>
                </div>
                <div className="display-start ">
                  <Checkbox
                    className="text"
                    onChange={() => handleCheckboxChange("Battle-Scarred")}
                  >
                    Battle-Scarred
                  </Checkbox>
                </div>
              </Panel>
            </Collapse>
          </Grid>
        </Grid>
        <Grid item md={5} lg={5} className="you-get">
          <Grid container style={{ gridGap: "5px" }}>
            <Grid container style={{ gridGap: "5px" }}>
              <Collapse
                defaultActiveKey={["1"]}
                onChange={onChange}
                style={{ width: "100%" }}
              >
                <Panel
                  header={
                    <div className="custom-panel-header">
                      <div>You get</div>
                      <div>$ {totalAdmin}</div>
                    </div>
                  }
                  key="1"
                >
                  {adminOffer.length > 0 ? (
                    <Grid container className="offer" style={{ gridGap: 10 }}>
                      {adminOffer?.map((item) => (
                        <CSItem
                          item={item}
                          width={18}
                          image={item.photo}
                          exterior={"FT"}
                          // float="0.2596"
                          price={item.price}
                          onButtonClick={handleCSItemAdminClick}
                          display={false}
                          height={100}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <p className="item-choose text">
                      Explore and choose the best skins
                    </p>
                  )}
                </Panel>
              </Collapse>
            </Grid>
            <Grid container className="border radius">
              <Grid
                container
                className=""
                style={{
                  height: 50,
                  padding: 13,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className="inputGroup search-inventory">
                  <Input
                    className="customInputAntd"
                    // value={search}
                    // onChange={(e) => setSearch(e.target.value)}
                    placeholder={language === "en" ? en.search : vi.search}
                    style={{ width: "90%" }}
                    // onKeyDown={handleKeyDown}
                  />
                  <div className="inputGroupAppendSearch">
                    <button
                      className="borderRight"
                      // onClick={() => handleSearch()}
                    >
                      <i className="fas fa-search" />
                    </button>
                  </div>
                </div>
                <div
                  className="spin"
                  style={{ cursor: "pointer" }}
                  onClick={() => getItems()}
                >
                  <ReloadOutlined />
                </div>
              </Grid>
              <Grid
                container
                className="inventory-trade"
                style={{ gridGap: 10 }}
              >
                {filter.length > 0
                  ? adminItems
                      ?.filter((item) =>
                        item.tags.some((item) =>
                          filter.includes(item.localized_tag_name)
                        )
                      )
                      ?.map((item) => (
                        <CSItem
                          item={item}
                          width={23}
                          image={item.photo}
                          exterior={"FT"}
                          // float="0.2596"
                          price={item.price}
                          onButtonClick={handleCSItemAdminClick}
                        />
                      ))
                  : adminItems?.map((item) => (
                      <CSItem
                        item={item}
                        width={23}
                        image={item.photo}
                        exterior={"FT"}
                        // float="0.2596"
                        price={item.price}
                        onButtonClick={handleCSItemAdminClick}
                      />
                    ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
