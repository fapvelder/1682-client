import React, { useContext, useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Grid, Input } from "@material-ui/core";
import { Button, Checkbox, InputNumber } from "antd";
import axios from "axios";
import { addFundUser, approvePaypal, createOrderPaypal } from "../../../../api";
import Paypal from "../../../../component/Paypal";
import { toast } from "react-toastify";
import { Store } from "../../../../Store";
import "./addFunds.css";
export default function AddFund() {
  const { state } = useContext(Store);
  const userID = state?.data?._id;
  const [value, setValue] = useState("");
  const [paypalKey, setPaypalKey] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const createOrder = async () => {
    try {
      const response = await createOrderPaypal(value);
      return response?.data?.id;
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const handleChangeValue = (e) => {
    setValue(e);
    setPaypalKey((prevKey) => prevKey + 1);
  };
  const onApprove = async (data) => {
    try {
      const response = await approvePaypal(data);
      const paypal = response?.data?.purchase_units[0]?.payments?.captures[0];
      if (paypal.status === "COMPLETED") {
        await addFundUser(userID, paypal.amount.value);
        toast.success("Add fund successfully");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <Grid container>
      <Grid container style={{ gridGap: 10 }}>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(5)}
          >
            $5
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(10)}
          >
            $10
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(25)}
          >
            $25
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(50)}
          >
            $50
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(100)}
          >
            $100
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(200)}
          >
            $200
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(300)}
          >
            $300
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(500)}
          >
            $500
          </Button>
        </Grid>

        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(800)}
          >
            $800
          </Button>
        </Grid>
        <Grid item md={2}>
          <Button
            style={{ width: "80%", height: 50 }}
            onClick={() => handleChangeValue(1000)}
          >
            $1000
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={6} className="paypalPayment">
          <Grid item md={12}>
            <div>Funding Amount:</div>
            <div>
              <InputNumber
                value={value}
                min={5}
                max={2000}
                onChange={(e) => handleChangeValue(e)}
              />{" "}
              USD
            </div>
          </Grid>
          <Grid item md={12}>
            <Checkbox onChange={handleCheckboxChange}>
              I understand that funds added to my wallet can only be used for
              purchases and cannot be withdrawn, refunded, or paid out.
            </Checkbox>
          </Grid>

          {value > 0 ? (
            <Grid item md={2}>
              <PayPalButtons
                key={paypalKey}
                disabled={!isChecked && value}
                createOrder={(data) => createOrder(data)}
                onApprove={(data) => onApprove(data)}
              />
            </Grid>
          ) : (
            <div className="pb-50" />
          )}
        </Grid>
        <Grid item md={6}>
          Recent transactions
        </Grid>
      </Grid>
    </Grid>
  );
}
