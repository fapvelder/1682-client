import UserRoute from "../component/ProtectedRoute/UserRoute";
import AdminDashboard from "../pages/AdminPages/AdminDashboard";
import Chat from "../pages/AuthPages/ChatPage/Chat";
import Homepage from "../pages/AuthPages/Homepage/Homepage";
import ProductDetails from "../pages/AuthPages/ProductDetailsPage";
import Profile from "../pages/AuthPages/ProfilePage";
import SellItem from "../pages/AuthPages/SellItemPage";
import GameItems from "../pages/AuthPages/SellItemPage/GameItems";
import ListingItem from "../pages/AuthPages/SellItemPage/ListingItems";
import Setting from "../pages/AuthPages/SettingPage";
import Wallet from "../pages/AuthPages/WalletPage";
import ForgotPassword from "../pages/NotAuthPages/ForgotPasswordPage/ForgotPassword";
import ResetPassword from "../pages/NotAuthPages/ForgotPasswordPage/ResetPassword";
import Login from "../pages/NotAuthPages/LoginPage/Login";
import Register from "../pages/NotAuthPages/RegisterPage/Register";

export const routes = [
  {
    path: "/",
    element: (
      // <UserRoute>
      <Homepage />
      // </UserRoute>
    ),
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/chat/:slug",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile/:slug",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Setting />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/item",
    children: [
      {
        path: ":productID",
        element: <ProductDetails />,
      },
    ],
  },
  {
    path: "/sell-item",
    children: [
      {
        path: "",
        element: <SellItem />,
      },

      {
        path: ":category",
        children: [
          {
            path: ":subcategory",
            children: [
              {
                path: ":gametitle",
                element: <GameItems />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/listing",
    element: <ListingItem />,
  },
  {
    path: "/wallet",
    element: <Wallet />,
  },
];
