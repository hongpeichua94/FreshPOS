import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// COMPONENTS
import UpdateInventoryModal from "../components/UpdateInventoryModal";
import AddInventoryModal from "../components/AddInventoryModal";

// ANT DESIGN
import {
  Divider,
  Layout,
  Table,
  Empty,
  theme,
  Space,
  Button,
  message,
} from "antd";

// SCRIPTS
import { getInventoryInfo, getFruitDetail } from "../scripts/api";

const { Content } = Layout;

const Inventory = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [fruitDetails, setFruitDetails] = useState({});

  const [showInventoryAddModal, setShowInventoryAddModal] = useState(false);
  const [showInventoryUpdateModal, setShowInventoryUpdateModal] =
    useState(false);

  const columns = [
    {
      title: "Last updated",
      dataIndex: "updated_at",
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
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateA - dateB;
      },
      width: "15%",
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "15%",
      render: (text) =>
        text ? (
          <img
            alt="item"
            loading="lazy"
            crossOrigin="anonymous" // image fetched without sending cookies or HTTP authentication
            // src={`https://freshpos.onrender.com${text.replace(
            //   /^public\//,
            //   "/"
            // )}`}
            src={`http://localhost:5001${text.replace(/^public\//, "/")}`}
            style={{ width: "100%", height: "auto", maxWidth: "100px" }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ),
    },
    {
      title: "Fruit",
      dataIndex: "name",
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
      width: "10%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "10%",
    },
    {
      title: "Sold",
      dataIndex: "sold",
      width: "10%",
    },
    {
      title: "Stock",
      render: (text, record) => {
        const stock = record.quantity - record.sold; // Calculate stock
        return <span>{stock}</span>; // Display the stock value
      },
      width: "10%",
    },
    {
      title: "Actions",
      key: "update",
      render: (record) => (
        <Space size="middle">
          <a
            style={{ color: "#216BFF" }}
            onClick={() => handleUpdateClick(record.id)}
          >
            Update
          </a>
          <a
            style={{ color: "#FF4D4F" }}
            onClick={() => removeFruit(record.id)}
          >
            Remove
          </a>
        </Space>
      ),
    },
  ];

  const fetchInventoryData = async (accessToken) => {
    setLoading(true);
    try {
      const data = await getInventoryInfo(accessToken);
      setInventory(data);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching inventory:", error);
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

  const fetchFruitDetails = async (id, accessToken) => {
    try {
      const data = await getFruitDetail(id, accessToken);
      setFruitDetails(data);
    } catch (error) {
      console.error("Error fetching fruit details :", error);
    }
  };

  const removeFruit = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to proceed to remove fruit from inventory?"
    );

    if (!confirmDelete) {
      return;
    }
    try {
      const res = await fetchData(
        "/api/fruit",
        "DELETE",
        { id: id },
        userCtx.accessToken
      );

      if (res.ok) {
        const deletedFruit = res.data.deletedFruit;
        message.success(`${deletedFruit.name} removed from inventory`);
        await fetchInventoryData(userCtx.accessToken);
      } else {
        alert(JSON.stringify(res.data));
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error removing fruit from inventory:", error);
    }
  };

  const handleUpdateClick = (id, accessToken) => {
    fetchFruitDetails(id, accessToken);
    setShowInventoryUpdateModal(true);
  };

  useEffect(() => {
    fetchInventoryData(userCtx.accessToken);
  }, [userCtx.accessToken]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      {showInventoryAddModal && (
        <AddInventoryModal
          setShowInventoryAddModal={setShowInventoryAddModal}
          fetchInventoryData={fetchInventoryData}
        />
      )}

      {showInventoryUpdateModal && (
        <UpdateInventoryModal
          id={fruitDetails.id}
          key={fruitDetails.id}
          name={fruitDetails.name}
          description={fruitDetails.description}
          image={fruitDetails.image}
          price={fruitDetails.price}
          quantity={fruitDetails.quantity}
          sold={fruitDetails.sold}
          setShowInventoryUpdateModal={setShowInventoryUpdateModal}
          fetchInventoryData={fetchInventoryData}
        />
      )}

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
          <Button
            type="primary"
            style={{ marginLeft: "auto", display: "block" }}
            onClick={() => setShowInventoryAddModal(true)}
          >
            Add New
          </Button>

          <Divider orientation="center">Inventory</Divider>
          <Table
            columns={columns}
            dataSource={inventory}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </Content>
    </div>
  );
};

export default Inventory;
