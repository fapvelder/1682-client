import React from "react";
import Role from "./AdminChildren/Role";
import { UserOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import { Tabs } from "antd";
import Platform from "./AdminChildren/Platform";
import Category from "./AdminChildren/Category";
import User from "./AdminChildren/User";
export default function AdminDashboard() {
  const children = [<User />, <Role />, <Platform />, <Category />];
  const tabName = [
    <span>User</span>,
    <span>Role</span>,
    <span>Platform </span>,
    <span>Category </span>,
  ];
  const icons = [<UserOutlined />, <UserOutlined />, <UserOutlined />];

  return (
    <div className="pb-50 mg-auto-80">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Tabs
        style={{ marginTop: 70 }}
        defaultActiveKey="1"
        centered
        items={new Array(6).fill(null).map((_, i) => {
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
  );
}
