import { Grid } from "@material-ui/core";
import { Button, Divider } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemSteam } from "../../../../api";
import { Store } from "../../../../Store";
import "./gameItems.css";
import { toast } from "react-toastify";

import { getError } from "../../../../utils.js";
import handleLoading from "../../../../component/HandleLoading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import Loading from "../../../../component/Loading";
export default function GameItems() {
  const { state } = useContext(Store);
  const params = useParams();
  const category = params.category;
  const subCategory = params.subcategory;
  const gameTitle = params.gametitle;
  const navigate = useNavigate();
  const { loading, setLoading, reload, setReload } = useLoading();
  const steam = state?.data?.profile?.steam;
  const url = "https://community.cloudflare.steamstatic.com/economy/image/";
  const [price, setPrice] = useState("");
  const [tradable, setTradable] = useState([]);
  const [steamInventory, setSteamInventory] = useState([]);
  const [priceInventory, setPriceInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const refreshInventory = async () => {
    handleLoading(
      async () => {
        const userID = state?.data?._id;
        const steamID = state?.data?.profile?.steam?.steamID;
        await getItemSteam(userID, steamID);
      },
      setLoading,
      setReload,
      "Refresh successfully"
    );
  };
  const handleContinue = () => {
    navigate("/listing", {
      state: {
        url: `${url}${selectedItem.icon_url}`,
        title: selectedItem.name,
        description: selectedItem.description,
        category: category,
        subCategory: subCategory,
        suggestedPrice: selectedItem.price,
        gameTitle: gameTitle,
      },
    });
  };
  useEffect(() => {
    setSteamInventory(
      steam?.steamInventory?.filter((item) => item.tradable === 1)
    );
  }, [steam?.steamInventory, reload]);
  useEffect(() => {
    const getPrice = async () => {
      if (steamInventory) {
        // const requests = steamInventory.map(
        //   (item) =>
        //     item.tradable === 1 &&
        //     axios.get(
        //       `https://gameflip.com/api/v1/steam/price/730/${item.market_hash_name}`
        //     )
        // );
        // const responses = await axios.all(requests);
        // const price = responses.map(
        //   (response) => response?.data.data.median_price
        // );
        setPriceInventory(
          steamInventory.map((item, index) => ({
            appid: item.appid,
            icon_url: item.icon_url,
            market_hash_name: item.market_hash_name,
            name: item.name,
            description: item.descriptions,
            assetID: item.assetid,
            tags: item.tags,
            // price: price[index],
            price: "1$",
          }))
        );
      }
    };
    getPrice();
  }, [steamInventory, reload]);

  return (
    <Grid container className="selling-item pb-50">
      {loading && <Loading />}
      <div className="mg-auto-80">
        <h3 className="mt-15"> Start Selling - CS:GO</h3>
        <Grid
          container
          style={{ gridGap: "79px" }}
          className="mg-auto-80 selectSkin"
        >
          <Grid item md={7} className="inventorySection">
            <h3>
              <span>Your Inventory</span>
            </h3>
            <Grid container>
              {steamInventory &&
                priceInventory.map((item) => (
                  <Grid
                    item
                    sm={4}
                    md={3}
                    className="product"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="specific-item">
                      <p className="text-start ml-15">{item?.price}</p>
                      <img src={`${url}${item.icon_url}`} alt="" />
                    </div>
                    <p>{item?.name}</p>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <Grid item md={4} className="skinSelectSection">
            <h3>
              <span>Skin to sell </span>
            </h3>
            <Grid container>
              <Grid
                container
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>{selectedItem ? 1 : 0} item(s) selected </div>
                <div>
                  <Button
                    className="defaultButton ml-15"
                    disabled={selectedItem ? false : true}
                    onClick={() => handleContinue()}
                  >
                    Continue
                  </Button>
                </div>
              </Grid>
              <Divider />
              {selectedItem && (
                <Grid container className="text-start">
                  <div className="chooseSection">
                    <div className="chooseItem">
                      <img src={`${url}${selectedItem.icon_url}`} alt="" />
                    </div>
                    <div style={{ padding: 10 }}>
                      <div>{selectedItem.name}</div>
                      <div style={{ color: "#E32636" }}>
                        Suggested Price: {selectedItem.price}
                      </div>
                      <div>
                        {selectedItem?.description?.map((item, index) => (
                          <div key={index}>
                            {item.value.split("\n").map((line, lineIndex) => (
                              <p key={lineIndex}>{line}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                      {selectedItem.tags.map((item) => (
                        <p>
                          {item.localized_category_name}:{" "}
                          {item.localized_tag_name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid container>
          <div>Your inventory</div>
          <Button onClick={() => refreshInventory()}>Refresh</Button>
        </Grid> */}
      </div>
    </Grid>
  );
}
