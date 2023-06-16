import React, { useContext } from "react";
import { Store } from "../../../Store";
import { Grid } from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Balance from "./WalletChildren/Balance.js";
import AddFunds from "./WalletChildren/AddFunds.js";
import Withdraw from "./WalletChildren/Withdraw.js";
export default function Wallet() {
  const { state } = useContext(Store);
  const items = [
    {
      key: "1",
      label: `Balance`,
      children: <Balance />,
    },
    {
      key: "2",
      label: `Add Funds`,
      children: <AddFunds />,
    },
    {
      key: "3",
      label: `Withdraw`,
      children: <Withdraw />,
    },
  ];
  return (
    <Grid container>
      <Helmet>
        <title>Wallet</title>
      </Helmet>
      <div className="mg-auto-80">
        <Tabs defaultActiveKey="1" items={items} className="tab" />
      </div>
    </Grid>
  );
}
