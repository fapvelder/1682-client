import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
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
import { getUserByID, logout, refresh } from "../../api";
import jwtDecode from "jwt-decode";
import logoName from "../img/logoName.png";
import darkLogoName from "../img/darkLogoName.png";
import sun from "../img/sun.png";
import moon from "../img/moon.png";
import { toast } from "react-toastify";
import { getError } from "../../utils";

export default function Navigation() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const user = state.data;
  const theme = localStorage.getItem("theme");
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
        <Grid item md={1}>
          <Link to="/">
            <img
              style={{ width: 110, height: 40, marginTop: -5, marginLeft: -5 }}
              src={theme === "dark" ? darkLogoName : logoName}
              alt="logo"
            />
          </Link>
        </Grid>
        <Grid item md={2}>
          <Search placeholder={language === "en" ? en.search : vi.search} />
        </Grid>
        <Grid item md={8}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              marginBottom: "-25px",
            }}
          >
            <ul>
              <li className="navbarList">
                <Link to="/a">
                  {language === "en" ? en.nav_game_items : vi.nav_game_items}
                </Link>
                <ul className="dropdown">
                  <section
                    style={{
                      display: "flex",
                      width: 400,
                      backgroundColor: "white",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                  >
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>{language === "en" ? en.popular : vi.popular}</span>
                      <li>{language === "en" ? en.all : vi.all}</li>
                      <li>Itunes</li>
                      <li>Google Plays</li>
                    </div>
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>
                        {language === "en" ? en.trending : vi.trending}
                      </span>
                      <li>Amazon</li>
                      <li>Walmart</li>
                      <li>Target</li>
                    </div>
                  </section>
                </ul>
              </li>
              <li className="navbarList">
                <Link to="#">
                  {language === "en" ? en.nav_gift_cards : vi.nav_gift_cards}
                </Link>
                <ul className="dropdown">
                  <section
                    style={{
                      display: "flex",
                      width: 400,
                      backgroundColor: "white",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                  >
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>Popular</span>
                      <li>All</li>
                      <li>Itunes</li>
                      <li>Google Plays</li>
                    </div>
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>Trending</span>
                      <li>Amazon</li>
                      <li>Walmart</li>
                      <li>Target</li>
                    </div>
                  </section>
                </ul>
              </li>
              <li className="navbarList">
                <Link to="/a">
                  {language === "en" ? en.nav_more : vi.nav_more}
                </Link>
                <ul className="dropdown">
                  <section
                    style={{
                      display: "flex",
                      width: 400,
                      backgroundColor: "white",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                  >
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>Popular</span>
                      <li>All</li>
                      <li>Itunes</li>
                      <li>Google Plays</li>
                    </div>
                    <div style={{ width: 400, marginTop: 5 }}>
                      <span>Trending</span>
                      <li>Amazon</li>
                      <li>Walmart</li>
                      <li>Target</li>
                    </div>
                  </section>
                </ul>
              </li>
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
          <Grid item md={1} className="profileContainer">
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginBottom: "-10px",
              }}
            >
              <ul>
                {/* <li className="navbarList">
                <img
                  src="https://production-gameflipusercontent.fingershock.com/us-east-1:23c8e81f-64ba-47cc-8bcc-68c787dd809c/avatar/87dd8626-5309-4efa-bb1f-d721320a7f82/320x320.webp"
                  alt=""
                />
                <ul className="dropdown">
                  <section style={{ width: 240 }} className="profile">
                    <li>Username</li>
                    <li>Start Selling</li>
                    <li>
                      <Link to="/chat">Messaging</Link>
                    </li>
                    <li>Notifications</li>
                  </section>
                </ul>
              </li> */}

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
                        <Link to="/chat">
                          {language === "en"
                            ? en.nav_profile.Messaging
                            : vi.nav_profile.Messaging}
                        </Link>
                      </li>
                      <li>
                        {" "}
                        {language === "en"
                          ? en.nav_profile.Notifications
                          : vi.nav_profile.Notifications}
                      </li>
                      <li>
                        <Link to="/wallet">
                          {language === "en"
                            ? en.nav_profile.Wallet
                            : vi.nav_profile.Wallet}
                        </Link>
                      </li>
                      <li>
                        {language === "en"
                          ? en.nav_profile.Listing
                          : vi.nav_profile.Listing}
                      </li>
                      <li>
                        {language === "en"
                          ? en.nav_profile.Purchases
                          : vi.nav_profile.Purchases}
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
        ) : (
          <Link to="/login">Login</Link>
        )}
      </Grid>
    </div>
  );
}
