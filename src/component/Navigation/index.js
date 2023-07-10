import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Layout, Menu } from "antd";
import Icon, {
  HomeOutlined,
  ApartmentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Store } from "../../Store";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import Search from "../Search";
import "./navigation.css";
import { Grid } from "@material-ui/core";
import en from "../languages/en.json";
import vi from "../languages/vi.json";
import Flag from "../languages/flag.js";
import { fetchCategories, getUserByID, logout, refresh } from "../../api";
import jwtDecode from "jwt-decode";
import logoName from "../img/logoName.png";
import darkLogoName from "../img/darkLogoName.png";
import sun from "../img/sun.png";
import moon from "../img/moon.png";
import { toast } from "react-toastify";
import { getError } from "../../utils";
import io from "socket.io-client";
import bell from "../img/bell.png";
export default function Navigation() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const user = state?.data;
  const theme = localStorage.getItem("theme");
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [categories, setCategories] = useState([]);

  const handleSearch = (categoryID, subCategory) => {
    navigate("/search/product");
    ctxDispatch({ type: "SET_CATEGORY", payload: categoryID });
    ctxDispatch({ type: "SET_SUBCATEGORY", payload: "" });
    if (subCategory) {
      ctxDispatch({ type: "SET_SUBCATEGORY", payload: subCategory });
    }
  };
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("msg-count", (data) => {
      if (data.to === user?._id) {
        setMessageCount((messageCount) => messageCount + 1);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("receive-notify", (data) => {
      if (data.userID === user?._id) {
        setNotificationCount((notificationCount) => notificationCount + 1);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    const fetchAllCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.data);
    };
    fetchAllCategories();
  }, []);
  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:5000");
      socket.emit("authenticate", user?._id);
      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const logoutHandler = async () => {
    ctxDispatch({ type: "USER_LOGOUT" });
    localStorage.removeItem("token");
    window.location.href = "/login";
    await logout();
  };

  useEffect(() => {
    const getUser = async () => {
      const userID = jwtDecode(state.token)._id;
      if (userID) {
        try {
          const result = await getUserByID(userID);
          ctxDispatch({ type: "SET_DATA", payload: result.data });
          const date =
            jwtDecode(state.token).exp - Math.floor(Date.now() / 1000);

          if (date < 3600) {
            const response = await refresh();
            localStorage.setItem("token", response.data.token);
          }
        } catch (err) {
          toast.error(getError(err));
          console.log(err);
          getError(err) === "Invalid token" && logoutHandler();
        }
      } else {
        logoutHandler();
      }
    };
    getUser();
  }, [state.token, ctxDispatch]);

  const [language, setLanguage] = useState("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  };
  useEffect(() => {
    ctxDispatch({ type: "SET_LANGUAGE", payload: language });
  }, [language, ctxDispatch]);
  // Hide navbar when route === /login
  const withOutNavbarRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
  ];
  const { pathname } = useLocation();
  if (withOutNavbarRoutes.some((item) => pathname.includes(item))) return null;
  //

  const navThemeText =
    language === "en"
      ? theme === "dark"
        ? " Dark Mode"
        : " Light Mode"
      : theme === "dark"
      ? " Chế độ tối"
      : " Chế độ sáng";
  return (
    <div className={`navigation`} style={{ marginBottom: 65 }}>
      <Grid container className="navContainer">
        <Grid item sm={4} md={2} lg={2}>
          <Link to="/">
            <img
              style={{ width: 110, height: 40, marginTop: -5, marginLeft: -5 }}
              src={theme === "dark" ? darkLogoName : logoName}
              alt="logo"
            />
          </Link>
        </Grid>
        <Grid item sm={4} md={3} lg={3}>
          <Search placeholder={language === "en" ? en.search : vi.search} />
        </Grid>
        <Grid item sm={4} md={6} lg={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              marginBottom: "-25px",
            }}
          >
            <ul>
              {categories?.map((category) => (
                <li
                  style={{
                    display: "none",
                  }}
                  className="navbarList"
                  key={category._id}
                >
                  <section className="listCategory">{category.name}</section>
                  <ul className="dropdown">
                    <section
                      style={{
                        display: "flex",
                        width: 200,
                        backgroundColor: "white",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={{ width: 200, marginTop: 5 }}>
                        <li onClick={() => handleSearch(category._id)}>All</li>
                        {category.subCategory.map((subCategory) => (
                          <span
                            onClick={() =>
                              handleSearch(category._id, subCategory.title)
                            }
                            key={subCategory._id}
                          >
                            <li>{subCategory.title}</li>
                          </span>
                        ))}
                      </div>
                    </section>
                  </ul>
                </li>
              ))}

              <li className="navbarList language">
                {language === "en" ? (
                  <Flag flagName="US" />
                ) : (
                  <Flag flagName="Vietnam" />
                )}
                <ul className="dropdownLanguage">
                  <section style={{ backgroundColor: "white" }}>
                    <li onClick={() => setLanguage("en")}>
                      <Flag flagName="US" /> English
                    </li>
                    <li onClick={() => setLanguage("vi")}>
                      <Flag flagName="Vietnam" /> Vietnamese
                    </li>
                  </section>
                </ul>
              </li>
              <li className="navbarList theme" style={{ marginLeft: 50 }}>
                <Link onClick={() => toggleTheme()}>
                  <img
                    style={{ width: 25, height: 25 }}
                    src={theme === "dark" ? moon : sun}
                    alt="theme"
                  />
                  {navThemeText}
                </Link>
              </li>
              <li className="navbarList">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>
        </Grid>
        {state.token ? (
          <Badge
            style={{ marginRight: 5, marginTop: 5 }}
            dot={notificationCount > 0 || messageCount > 0}
          >
            <Grid item md={1} lg={1} className="profileContainer">
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginBottom: "-10px",
                }}
              >
                <ul>
                  <li className="navbarList">
                    <img src={user?.avatar} alt={user?.fullName} />
                    <ul className="dropdownProfile">
                      <section
                        style={{ backgroundColor: "white", width: "220px" }}
                        className="profile"
                      >
                        <li>
                          <Link to={`/profile/${user?.slug}`}>
                            <img
                              className="dropdownProfileImg"
                              src={user?.avatar}
                              alt={user?.fullName}
                            />{" "}
                            {user?.displayName || user?.fullName}
                          </Link>
                        </li>
                        <li>
                          <Link to={"/sell-item"}>
                            {language === "en"
                              ? en.nav_profile.Selling
                              : vi.nav_profile.Selling}
                          </Link>
                        </li>
                        <li>
                          <Link to="/chat" onClick={() => setMessageCount(0)}>
                            {language === "en"
                              ? en.nav_profile.Messaging
                              : vi.nav_profile.Messaging}

                            <Badge
                              style={{ marginLeft: 5 }}
                              count={messageCount > 0 ? messageCount : 0}
                              overflowCount={10}
                            />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/notifications"
                            onClick={() => setNotificationCount(0)}
                            style={{ display: "inline" }}
                          >
                            {language === "en"
                              ? en.nav_profile.Notifications
                              : vi.nav_profile.Notifications}

                            <Badge
                              style={{ marginLeft: 5 }}
                              count={
                                notificationCount > 0 ? notificationCount : 0
                              }
                              overflowCount={10}
                            />
                          </Link>
                        </li>
                        <li>
                          <Link to="/wallet">
                            {language === "en"
                              ? en.nav_profile.Wallet
                              : vi.nav_profile.Wallet}
                          </Link>
                        </li>
                        <li>
                          <Link to="/listings">
                            {language === "en"
                              ? en.nav_profile.Listing
                              : vi.nav_profile.Listing}
                          </Link>
                        </li>
                        <li>
                          <Link to="/purchases">
                            {language === "en"
                              ? en.nav_profile.Purchases
                              : vi.nav_profile.Purchases}
                          </Link>
                        </li>
                        <li>
                          <Link to="/settings">
                            {language === "en"
                              ? en.nav_profile.Settings
                              : vi.nav_profile.Settings}
                          </Link>
                        </li>
                        <li onClick={() => logoutHandler()}>
                          {language === "en"
                            ? en.nav_profile.Signout
                            : vi.nav_profile.Signout}
                        </li>
                      </section>
                    </ul>
                  </li>
                </ul>
              </div>
            </Grid>
          </Badge>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Grid>
    </div>
  );
}
