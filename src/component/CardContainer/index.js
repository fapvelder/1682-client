import React from "react";
import "./card.css";
import { Grid } from "@material-ui/core";
export default function CardContainer({
  title,
  img,
  width = "250px",
  height = "250px",
}) {
  return (
    <Grid item xs={6} md={4} lg={3}>
      <div className="card-container">
        <img src={img} alt={title} style={{ width: width, height: height }} />
        <div className="card-title">{title}</div>
      </div>
    </Grid>
  );
}
