import React, { useContext, useState } from "react";
import { payoutPaypal, requestSecret } from "../../../../api";
import { Grid } from "@material-ui/core";
import { Button, Input, InputNumber } from "antd";
import { Store } from "../../../../Store.js";
import { getError } from "../../../../utils";
import { toast } from "react-toastify";
export default function Withdraw() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [secret, setSecret] = useState("");
  const { state } = useContext(Store);
  const userID = state?.data?._id;
  const handlePayout = async () => {
    try {
      await payoutPaypal(secret, userID, amount, email);
      toast.success("success");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const sendSecret = async () => {
    try {
      await requestSecret(userID);
      toast.success("Please check your email");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Grid container>
      <InputNumber
        value={amount}
        onChange={(e) => setAmount(e)}
        min={5}
        max={10000}
      />
      <Input placeholder="Secret" onChange={(e) => setSecret(e.target.value)} />
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={handlePayout}>Click to payout</Button>

      <Button onClick={sendSecret}>Send Secret</Button>
    </Grid>
  );
}
