import React, { useEffect, useState } from "react";
import { getProductLog } from "../../../api";
import { Space, Table } from "antd";
import moment from "moment";

export default function UserLog() {
  const [logUser, setLogUser] = useState([]);
  useEffect(() => {
    const getLog = async () => {
      const result = await getProductLog();
      setLogUser(result.data);
    };
    getLog();
  }, []);
  const data = logUser?.map((data) => ({
    key: data._id,
    name: data.user.displayName || data.user.fullName,
    email: data.user.email,
    title: data.title,
    photo: data.photos[0],
    price: data.price,
    time: data.createdAt,
    updated: data.updatedAt,
  }));
  console.log(data);
  const columns = [
    {
      title: "User Action",
      dataIndex: "user",
      key: "user",
      width: "80%",
      render: (_, record) => (
        <div>
          {record.name} has been listed {record.title} with price $
          {record.price} at {moment(record.time).format("LLL")}
        </div>
      ),
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      width: "10%",
      render: (_, record) => (
        <img width={150} height={150} src={record.photo} alt={record.title} />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "10%",
      render: (text) => text,
    },
  ];
  return <Table columns={columns} dataSource={data} />;
}
