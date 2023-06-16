import axios from "axios";
import React from "react";
import { createOrderPaypal } from "../../api";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function Paypal({ value }) {
  const createOrder = async () => {
    try {
      const response = await createOrderPaypal(value);
      return response?.data?.id;
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const onApprove = async (data) => {
    try {
      const response = await axios.post(
        "/my-server/capture-paypal-order",
        {
          orderID: data?.orderID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const initialOptions = {
    "client-id":
      "ATnrF65tRGaJUmG_qEGFOqbGCHqC5X635TqD3X6cEi8PkkPa1TpFrqIu3d9Zdz4Hq_TbsBa536Npt_Qh",
    currency: "USD",
    intent: "capture",
    // "data-client-token": "abc123xyz==",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data) => createOrder(data)}
        onApprove={(data) => onApprove(data)}
      />
    </PayPalScriptProvider>
  );
}
