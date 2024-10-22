import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../context/user";

// COMPONENTS
import UpdateInventoryModal from "../components/UpdateInventoryModal";
import AddInventoryModal from "../components/AddInventoryModal";

// ANT DESIGN
import { Divider, Layout, Table, Empty, theme, Space, Button } from "antd";

// SCRIPTS
import { getInventoryInfo, getFruitDetail } from "../scripts/api";

const { Content } = Layout;

const Inventory = () => {
  const userCtx = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [showInventoryUpdateModal, setShowInventoryUpdateModal] =
    useState(false);
  const [fruitDetails, setFruitDetails] = useState({});

  const [showInventoryAddModal, setShowInventoryAddModal] = useState(false);

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
      dataIndex: "image_url",
      width: "15%",
      render: (text) =>
        text ? (
          <img
            src={text}
            alt="item"
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
      title: "Total sold",
      dataIndex: "sold",
      width: "10%",
    },
    {
      title: "",
      key: "update",
      render: (record) => (
        <Space size="middle">
          <a
            style={{ color: "#216BFF" }}
            onClick={() => handleUpdateClick(record.id)}
          >
            Update
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
      console.error("Error fetching fruit deatils :", error);
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
          imageUrl={fruitDetails.image_url}
          price={fruitDetails.price}
          quantity={fruitDetails.quantity}
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
