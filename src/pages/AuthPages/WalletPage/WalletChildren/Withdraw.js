import React, { useContext, useEffect, useState } from "react";
import { getUserByID, payoutPaypal, requestSecret } from "../../../../api";
import { Grid } from "@material-ui/core";
import { Button, Input, InputNumber } from "antd";
import { Store } from "../../../../Store.js";
import { getError } from "../../../../utils";
import { toast } from "react-toastify";
import "./withdraw.css";
import paypalTrans from "../../../../component/img/paypaltrans.png";
import handleLoading from "../../../../component/HandleLoading";
import useLoading from "../../../../component/HandleLoading/useLoading";
import Loading from "../../../../component/Loading";
export default function Withdraw() {
  const { loading, setLoading, reload, setReload } = useLoading();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [secret, setSecret] = useState("");
  const [payment, setPayment] = useState("");
  const [withdrawalFee, setWithdrawalFee] = useState("");
  const [remainBalance, setRemainBalance] = useState("");
  const [totalSubtract, setTotalSubtract] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const userID = state?.data?._id;
  const balance = state?.data?.wallet.toFixed(2);
  useEffect(() => {
    const handleFee = (value) => {
      if (value <= balance) {
        setAmount(Number(value));
        setWithdrawalFee(Number(value * 0.05).toFixed(2));
        setTotalSubtract(Number(value + value * 0.05));
        setRemainBalance((Number(balance) - totalSubtract).toFixed(2));
      }
    };
    handleFee(amount);
  }, [amount, withdrawalFee, remainBalance, balance, totalSubtract]);

  const handlePayout = async () => {
    handleLoading(
      async () => {
        await payoutPaypal(secret, userID, amount, withdrawalFee, email);
      },
      setLoading,
      setReload,
      "Success"
    );
  };
  useEffect(() => {
    const getUser = async () => {
      if (state) {
        try {
          const result = await getUserByID(state?.data._id);
          console.log(result);
          ctxDispatch({ type: "SET_DATA", payload: result.data });
        } catch (err) {
          toast.error(getError(err));
        }
      }
    };
    getUser();
  }, [ctxDispatch, reload]);

  const sendSecret = async () => {
    handleLoading(
      async () => {
        await requestSecret(userID);
      },
      setLoading,
      setReload,
      "Please check your email"
    );
  };
  return (
    <Grid container className="withdraw pb-50">
      Available Cash for Payout: ${balance} USD
      <Grid container className="customSection">
        {loading && <Loading />}

        <Grid item md={6}>
          <div>Payout Choices</div>
          <img
            className="payoutChoices"
            onClick={() => setPayment("Paypal")}
            src={paypalTrans}
            alt=""
          />
          <div className="mt-15">
            This payout option is only available when the balance is $5.00 or
            higher
          </div>
          {payment === "Paypal" && (
            <div>
              <div className="mt-15">
                <InputNumber
                  value={amount}
                  onChange={(e) => setAmount(e)}
                  min={5}
                  max={10000}
                />
              </div>
              <div className="inputGroup mt-15">
                <Input
                  placeholder="Email received"
                  className="customInputAntd"
                  style={{
                    width: "40%",
                    borderTopRightRadius: !email.includes("@") && 5,
                    borderBottomRightRadius: !email.includes("@") && 5,
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  onClick={() => sendSecret()}
                  style={{
                    color: "orange",
                  }}
                  className={`inputGroupAppend getCode ${
                    email.includes("@") && "visible"
                  }`}
                >
                  {" "}
                  Get Code
                </button>
                {/* <Button onClick={sendSecret}>Send Secret</Button> */}
              </div>
              <div className="mt-15">
                <Input
                  placeholder="Secret"
                  style={{ width: "40%" }}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
              <div className="mt-15">
                <Grid container className="withdrawFee">
                  <Grid container className="customWithdrawFee bd-bt">
                    <Grid item md={11}>
                      Withdrawal fee
                    </Grid>
                    <Grid item md={1}>
                      {withdrawalFee}
                    </Grid>
                  </Grid>

                  <Grid container className="customWithdrawFee bd-bt">
                    <Grid item md={11}>
                      What you will receive
                    </Grid>
                    <Grid item md={1}>
                      {amount}
                    </Grid>
                  </Grid>
                  <Grid container className="customWithdrawFee">
                    <Grid item md={11}>
                      Remaining balance
                    </Grid>
                    <Grid item md={1}>
                      {remainBalance}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              <div className="mt-15">
                <Button onClick={handlePayout}>Confirm payout</Button>
              </div>
            </div>
          )}
        </Grid>
        {payment === "Paypal" && (
          <Grid item md={6}>
            <div>
              <div>Fee rate</div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {payment}
              </div>
              <Grid container className="customWithdrawFee bd-bt">
                <Grid item md={10}>
                  $0.00 to $5.00
                </Grid>
                <Grid item md={2}>
                  Not available
                </Grid>
              </Grid>
              <Grid container className="customWithdrawFee bd-bt">
                <Grid item md={10}>
                  $5.00 and above
                </Grid>
                <Grid item md={2}>
                  0.50 % USD
                </Grid>
              </Grid>
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
