// import axios from "axios";
// import React from "react";
// import { createOrderPaypal } from "../../api";
// import { PayPalButtons } from "@paypal/react-paypal-js";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// export default function Paypal({ value }) {
//   const createOrder = async () => {
//     try {
//       const response = await createOrderPaypal(value);
//       return response?.data?.id;
//     } catch (error) {
//       // Handle error
//       console.error(error);
//     }
//   };
//   const onApprove = async (data) => {
//     try {
//       const response = await axios.post(
//         "/my-server/capture-paypal-order",
//         {
//           orderID: data?.orderID,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       // Handle error
//       console.error(error);
//     }
//   };
//   const initialOptions = {
//     "client-id":
//       "Ad1PYS-hNxpTe0Kq_9k6h6xwxPMIWDv24zxLojAR_oXAlfn0NjYe2mvko_8BDws_Dj4TfyMFkgmlLyf-",
//     currency: "USD",
//     intent: "capture",
//     // "data-client-token": "abc123xyz==",
//   };
//   return (
//     <PayPalScriptProvider options={initialOptions}>
//       <PayPalButtons
//         createOrder={(data) => createOrder(data)}
//         onApprove={(data) => onApprove(data)}
//       />
//     </PayPalScriptProvider>
//   );
// }
