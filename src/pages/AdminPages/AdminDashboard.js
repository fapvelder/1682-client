import React from "react";
import Role from "./AdminChildren/Role";
import { UserOutlined, LineChartOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Platform from "./AdminChildren/Platform";
import Category from "./AdminChildren/Category";
import User from "./AdminChildren/User";
import { Grid } from "@material-ui/core";
import UserItems from "./AdminChildren/UserItems";
import UserChart from "./AdminChildren/UserChart";
import UserLog from "./AdminChildren/UserLog";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { GiFlatPlatform } from "react-icons/gi";
import { BiCategory } from "react-icons/bi";
import { RxActivityLog } from "react-icons/rx";
import { TbChartHistogram } from "react-icons/tb";

export default function AdminDashboard() {
  const children = [
    <User />,
    <Role />,
    <Platform />,
    <Category />,
    <UserItems />,
    <UserChart />,
    <UserLog />,
  ];
  const tabName = [
    <span> User</span>,
    <span> Role</span>,
    <span> Platform </span>,
    <span> Category </span>,
    <span> User Items </span>,
    <span> Revenue </span>,
    <span> User Activities </span>,
  ];
  const icons = [
    <UserOutlined style={{ fontSize: 18 }} />,
    <RiAdminLine style={{ fontSize: 18 }} />,
    <GiFlatPlatform style={{ fontSize: 18 }} />,
    <BiCategory style={{ fontSize: 18 }} />,
    <MdOutlineInventory2 style={{ fontSize: 18 }} />,
    <TbChartHistogram style={{ fontSize: 18 }} />,
    <RxActivityLog style={{ fontSize: 18 }} />,
  ];

  return (
    <Grid container className="pb-50">
      <div className="mt-15 mg-auto-80 admin">
        <Helmet>
          <title>Admin Dashboard</title>
        </Helmet>
        <Tabs
          defaultActiveKey="1"
          centered
          items={new Array(7).fill(null).map((_, i) => {
            return {
              label: (
                <span>
                  {icons[i]}
                  {tabName[i]}
                </span>
              ),
              key: i,
              children: children[i],
            };
          })}
        />
      </div>
    </Grid>
  );
}
