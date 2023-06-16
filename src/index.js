import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./Store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(document.getElementById("root"));
const initialOptions = {
  "client-id":
    "ATnrF65tRGaJUmG_qEGFOqbGCHqC5X635TqD3X6cEi8PkkPa1TpFrqIu3d9Zdz4Hq_TbsBa536Npt_Qh",
  currency: "USD",
  intent: "capture",
  // "data-client-token": "abc123xyz==",
};
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <BrowserRouter>
          <PayPalScriptProvider options={initialOptions}>
            <App />
          </PayPalScriptProvider>
        </BrowserRouter>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
