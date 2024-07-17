import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";

// COMPONENTS
import NavBar from "../components/NavBar";

// ANT DESIGN
import { Divider, Layout, Table, theme } from "antd";

// SCRIPTS
import { getUserOrders } from "../scripts/api";

const { Content } = Layout;

const Orders = () => {
  const userCtx = useContext(UserContext);

  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: "Purchased On",
      dataIndex: "created_at",
      render: (text) => {
        const date = new Date(text);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      },
      sorter: true,
      sorter: (a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      },
      width: "15%",
    },
    {
      title: "Order Id",
      dataIndex: "uuid",
      width: "25%",
    },
    {
      title: "Item(s)",
      dataIndex: "items",
      width: "20%",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      render: (text) => `$${text}`,
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "Pending",
          value: "PENDING",
        },
        {
          text: "Confirmed",
          value: "CONFIRMED",
        },
        {
          text: "Delivered",
          value: "DELIVERED",
        },
        {
          text: "Cancelled",
          value: "CANCELLED",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text) => {
        const properCase = text.charAt(0) + text.slice(1).toLowerCase();
        return properCase;
      },
      width: "15%",
    },
  ];

  const fetchUserOrders = async (userId, accessToken) => {
    setLoading(true);
    try {
      const data = await getUserOrders(userId, accessToken);
      setUserOrders(data);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching user orders :", error);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams(
      {
        pagination,
        filters,
        ...sorter,
      },
      [userCtx.accessToken]
    );

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  useEffect(() => {
    if (userCtx.userId) {
      fetchUserOrders(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <NavBar></NavBar>
      <Content
        style={{
          margin: "10px 16px",
        }}
      >
        <div
          style={{
            padding: 50,
            minHeight: "90vh",
            maxWidth: "100vw",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">My Order History</Divider>
          <Table
            columns={columns}
            dataSource={userOrders}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </Content>
    </div>
  );
};

export default Orders;
