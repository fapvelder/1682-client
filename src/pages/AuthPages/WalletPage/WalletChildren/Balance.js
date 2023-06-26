import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import "./balance.css";
import { Store } from "../../../../Store";

export default function Balance() {
  const { state } = useContext(Store);
  const balance = state?.data?.wallet.toFixed(2);
  return (
    <Grid container className="pb-50">
      <Grid container>
        <div className="customContainer">
          <div>Your balance</div>
          <div className="balanceContainer">
            <Grid container className="bd-bt">
              <Grid item md={6}>
                Available
              </Grid>
              <Grid item md={6}>
                ${balance} USD
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                Pending
              </Grid>
              <Grid item md={6}>
                $0.00 USD
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="customContainer" style={{ marginTop: 20 }}>
          <div>Cash from completed sales</div>
          <div className="balanceContainer">
            <Grid container className="bd-bt">
              <Grid item md={6}>
                Available
              </Grid>
              <Grid item md={6}>
                ${balance} USD
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                Pending
              </Grid>
              <Grid item md={6}>
                $0.00 USD
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
