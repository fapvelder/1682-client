import React from "react";
import "./UserDetails.css";
import { Grid } from "@material-ui/core";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function UserDetails({
  currentChatUser,
  contact,
  width = "80%",
}) {
  const navigate = useNavigate();
  return (
    <Grid
      container
      className="userDetailsContainer"
      style={{ width: width, height: "150px" }}
    >
      <Grid item md={3}>
        <img
          className="cursorPointer"
          onClick={() => navigate(`/profile/${currentChatUser.slug}`)}
          src={currentChatUser?.avatar}
          alt={currentChatUser?.fullName}
        />
      </Grid>
      <Grid item md={9}>
        <div className="text-start">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "10px",
              marginTop: "5px",
            }}
          >
            <p
              className="userName cursorPointer"
              onClick={() => navigate(`/profile/${currentChatUser.slug}`)}
            >
              {currentChatUser?.displayName || currentChatUser?.fullName}
            </p>
            {contact && (
              <Button
                className="defaultButton"
                onClick={() => navigate(`/chat/${currentChatUser?.slug}`)}
              >
                <i className="fas fa-comments" style={{ cursor: "pointer" }} />
                &nbsp; Contact
              </Button>
            )}
          </div>
          <p>
            Member since {moment(currentChatUser?.since).format("MMM YYYY")}
          </p>
          <p>Seller Rating: Not available</p>
          {currentChatUser?.profile?.communication &&
            currentChatUser?.profile?.communication.length > 0 && (
              <p>
                Languages:{" "}
                {currentChatUser?.profile?.communication?.map((item, index) => (
                  <React.Fragment key={item._id}>
                    {`${item.language} (${item?.proficiency})`}
                    {index !== currentChatUser.profile.communication.length - 1
                      ? ", "
                      : ""}
                  </React.Fragment>
                ))}
              </p>
            )}
        </div>
      </Grid>
    </Grid>
  );
}
