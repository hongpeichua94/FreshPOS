import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// COMPONENTS
import NavBar from "../components/NavBar";

// ANT DESIGN
import { Divider, Layout, Table, Space, theme, message } from "antd";

// SCRIPTS
import { getAllOrders } from "../scripts/api";

const { Content } = Layout;

const Orders = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [allOrders, setAllOrders] = useState([]);
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
      // sorter: true,
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
      width: "20%",
    },
    {
      title: "User",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "Item(s)",
      dataIndex: "items",
      width: "20%",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
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
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          {record.status === "PENDING" && (
            <a
              style={{ color: "#28B48A" }}
              onClick={() => handleAcceptOrder(record.uuid)}
            >
              Accept Order
            </a>
          )}
        </Space>
      ),
    },
  ];

  const fetchAllOrders = async (userId, accessToken) => {
    setLoading(true);
    try {
      const data = await getAllOrders(userId, accessToken);
      setAllOrders(data);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  const handleAcceptOrder = async (uuid) => {
    const res = await fetchData(
      "/api/order/new",
      "PATCH",
      {
        uuid: uuid,
        status: "CONFIRMED",
      },
      userCtx.accessToken
    );
    if (res.ok) {
      message.success("Order accepted!");
      await fetchAllOrders(userCtx.accountId, userCtx.accessToken);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
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
      fetchAllOrders(userCtx.userId, userCtx.accessToken);
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
            minHeight: "50vh",
            maxWidth: "100vw",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">All Orders</Divider>
          <Table
            columns={columns}
            dataSource={allOrders}
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
