import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";

// COMPONENTS
import NavBar from "../components/NavBar";
import UpdateProfileModal from "../components/UpdateProfileModal";

// ANT DESIGN
import { Layout, Button, Badge, theme } from "antd";
import { EditOutlined } from "@ant-design/icons";

// MODULE CSS
import styles from "./Profile.module.css";

// SCRIPTS
import { getAccountInfo } from "../scripts/api";

const { Content } = Layout;

const Profile = () => {
  const userCtx = useContext(UserContext);
  const [userDetails, setUserDetails] = useState([]);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

  const fetchUserDetails = async (userId, accessToken) => {
    try {
      const data = await getAccountInfo(userId, accessToken);
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user deatils :", error);
    }
  };
  useEffect(() => {
    if (userCtx.userId) {
      fetchUserDetails(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      {showProfileUpdateModal && (
        <UpdateProfileModal
          id={userDetails.uuid}
          status={userDetails.status}
          firstName={userDetails.first_name}
          lastName={userDetails.last_name}
          phone={userDetails.phone}
          email={userDetails.email}
          setShowProfileUpdateModal={setShowProfileUpdateModal}
          fetchUserDetails={fetchUserDetails}
        />
      )}
      <div className={styles.profile}>
        <NavBar></NavBar>
        <Layout style={{ minHeight: "100vh" }}>
          <Layout style={{ height: "100vh", overflow: "auto" }}>
            <div className="details">
              <Content style={{ margin: "0 16px" }}>
                <div
                  style={{
                    margin: 20,
                    padding: 24,
                    minHeight: "80vh",
                    maxWidth: "100vw",
                    background: colorBgContainer,

                    borderRadius: borderRadiusLG,
                  }}
                >
                  <div className="personal" style={{ background: "white" }}>
                    <div className="row">
                      <h5 className="col-md-3">Personal Details</h5>
                      <Button
                        className="col-md-1"
                        icon={<EditOutlined />}
                        onClick={() => setShowProfileUpdateModal(true)}
                      >
                        Edit
                      </Button>
                    </div>
                    <br />
                    <table>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>User Id</th>
                          <th>{userDetails.uuid}</th>
                        </tr>
                      </thead>
                      <tbody className={styles.tableCell}>
                        <tr>
                          <th>First Name</th>
                          <td>{userDetails.first_name}</td>
                        </tr>
                        <tr>
                          <th>Last Name</th>
                          <td>{userDetails.last_name}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{userDetails.email}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{userDetails.phone}</td>
                        </tr>
                        <tr>
                          <th>Member since</th>
                          <td>{userDetails.created_at}</td>
                        </tr>
                        <tr>
                          <th>Status</th>
                          <td>
                            {" "}
                            {userDetails.status === "ACTIVE" ? (
                              <Badge status="success" />
                            ) : (
                              <Badge status="error" />
                            )}{" "}
                            {userDetails.status}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Content>
            </div>
          </Layout>
        </Layout>
      </div>
    </>
  );
};

export default Profile;
