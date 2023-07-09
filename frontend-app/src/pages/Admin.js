// pages
import { useEffect, useState } from "react";
import Task from "../taskpages/Task";
import { Layout, Typography, Modal, Form, Input, Button, Space, Table, Tag, List, Skeleton, Avatar, Popconfirm, Col, Row, Select, Divider } from "antd";
import { UserOutlined, LogoutOutlined, PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";

// router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthUser from "../auth/AuthUser";

const Admin = () => {
  const { Content, Footer } = Layout;
  const { Title } = Typography;

  const { http } = AuthUser();
  const [userDetails, setUserDetails] = useState("");

  const style = {
    padding: "8px 0",
  };
  const fetchUserDetails = () => {
    http
      .post("/me")
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 401) {
          logout();
        }
      });
  };

  const cancel = (e) => {
    console.log("operation cancelled");
  };

  const { token, logout } = AuthUser();
  const logoutUser = () => {
    if (token != undefined) {
      logout();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="App">
      <Layout style={{ backgroundColor: "white" }}>
        <Content style={{ padding: "20px 20px" }}>
          {userDetails && (
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}>
              <Col flex="6">
                <div style={style}>
                  <Title level={2} style={{ textAlign: "left", margin: "0px", padding: "0px" }}>
                    <UserOutlined /> {userDetails.name}
                  </Title>
                  <Title level={5} style={{ textAlign: "left", margin: "0px", padding: "0px" }}>
                    {userDetails.email}
                  </Title>
                </div>
              </Col>
              <Col flex="3">
                <div style={style}></div>
              </Col>
              <Col flex="3">
                <div style={{ padding: "8px 0", textAlign: "right" }}>
                  <Popconfirm title="Logout?" description="Really logout?" onConfirm={() => logoutUser()} onCancel={cancel} okText="Yes" cancelText="No">
                    <Button shape="square" type="dashed" danger icon={<LogoutOutlined />}>
                      Logout
                    </Button>
                  </Popconfirm>
                </div>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>
      <div>
        <Routes>
          <Route path="/home" element={userDetails && <Task userDetails={userDetails} />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
