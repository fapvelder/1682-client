import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserBySlug } from "../../../api";
import { Grid } from "@material-ui/core";
import banner from "../../../component/img/banner.png";
import "./profile.css";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Listings from "./ProfileChildren/Listings";
import Ratings from "./ProfileChildren/Ratings";
import moment from "moment";
import { Store } from "../../../Store";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import Loading from "../../../component/Loading";

export default function Profile() {
  const { loading, setLoading, reload, setReload } = useLoading();

  const { state } = useContext(Store);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      const result = await getUserBySlug(slug);
      setUser(result.data);
    };
    getUser();
  }, [slug]);
  const items = [
    {
      key: 1,
      label: `Listings`,
      children: (
        <Listings
          slug={slug}
          loading={loading}
          setLoading={setLoading}
          reload={reload}
          setReload={setReload}
          handleLoading={handleLoading}
          Loading={Loading}
        />
      ),
    },
    {
      key: 2,
      label: `Ratings`,
      children: (
        <Ratings
          slug={slug}
          loading={loading}
          setLoading={setLoading}
          reload={reload}
          setReload={setReload}
          handleLoading={handleLoading}
          Loading={Loading}
        />
      ),
    },
    // {
    //   key: "3",
    //   label: `Gallery`,
    //   children: `Content of Tab Pane 3`,
    // },
  ];

  return (
    <Grid container className="pb-50">
      <Helmet>
        <title>{user?.displayName || user?.fullName}</title>
      </Helmet>
      <Grid container>
        <div className="coverPhoto">
          <img src={banner} alt="" />
        </div>
      </Grid>
      <Grid container>
        <Grid item md={4}>
          <div className="avatar">
            <img src={user?.avatar} alt={user?.fullName} />
          </div>
        </Grid>
        <Grid item md={8}>
          <div className="details">
            <div className="profileDetails">
              {user?.displayName || user?.fullName}
            </div>
            <p>
              Member since {moment(user?.since).format("MMM YYYY")}
              {"    "}
              {user?._id === state?.data?._id ? (
                <i
                  className="fas fa-pen"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/settings`)}
                />
              ) : (
                <i
                  className="fas fa-comments"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/chat/${user?.slug}`)}
                />
              )}
            </p>
            <p>About</p>
            <p>{user?.profile?.bio}</p>
            <p>Languages</p>
            {user?.profile?.communication.map((item) => (
              <p key={item._id}>{`${item?.language} (${item?.proficiency})`}</p>
            ))}
            <p>Feedback ratings</p>
            <Grid container className="feedback">
              <p style={{ marginLeft: 25 }}>Selling Summary</p>
              <table>
                <thead>
                  <tr>
                    <th className="width-200"></th>
                    <th className="width-100">Good</th>
                    <th className="width-100">Neutral</th>
                    <th className="width-100">Poor</th>
                    <th className="width-100">Ratings</th>
                    <th className="width-100">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="day">30 days</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td className="day">90 days</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td className="day">180 days</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td className="day">12 months</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td className="day">Lifetime</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <div className="tabs">
          <Tabs defaultActiveKey="1" items={items} className="tab" />
        </div>
      </Grid>
    </Grid>
  );
}
