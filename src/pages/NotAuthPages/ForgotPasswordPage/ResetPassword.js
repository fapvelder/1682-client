import { Grid } from "@material-ui/core";
import { Button, Input } from "antd";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../../api";
import { getError } from "../../../utils";
import useLoading from "../../../component/HandleLoading/useLoading";
import handleLoading from "../../../component/HandleLoading";
import Loading from "../../../component/Loading";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const { loading, setLoading, setReload } = useLoading();

  const submitHandler = async () => {
    if (newPassword === confirmPassword) {
      handleLoading(
        async () => {
          await resetPassword(token, newPassword);
        },
        setLoading,
        setReload,
        "Changed password successfully"
      );
    } else {
      toast.error("Please make sure both passwords match");
    }
  };
  return (
    <Grid container>
      {loading && <Loading />}
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <Grid item xs={false} sm={3} md={5} />
      <Grid item xs={12} sm={6} md={3}>
        <div className="forgot-password">
          <center>
            <img
              style={{
                width: 128,
                height: 128,
                marginBottom: 15,
                marginTop: 50,
              }}
              src="https://cdn-icons-png.flaticon.com/512/625/625130.png"
              alt="unlock"
            />
            <p style={{ marginBottom: 15 }}>Input to change password</p>

            <Input.Password
              placeholder={"Input your new password"}
              style={{ width: "80%", marginBottom: 15 }}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <Input.Password
              style={{ width: "80%", marginBottom: 15 }}
              placeholder={"Input confirm password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              style={{ width: "80%", marginBottom: 15 }}
              onClick={(e) => submitHandler(e)}
              type="primary"
            >
              Change password
            </Button>
          </center>
        </div>
      </Grid>
    </Grid>
  );
}
