import { Grid } from "@material-ui/core";
import { Card, Divider, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import "./ProductList.css";

const { Title } = Typography;
export default function ProductList({ img, title, price }) {
  return (
    // <Grid container>
    //   <Grid item xs={6} md={2} lg={2}>
    <div className="productCard">
      <Card
        className="productImg backgroundProduct text-start"
        cover={<img alt={title} src={img} />}
      />
      <div className="text-start">
        <div className="title-container">
          <p>{title}</p>
        </div>
        <p>${price} USD</p>
      </div>
    </div>
    //   </Grid>
    // </Grid>
  );
}
