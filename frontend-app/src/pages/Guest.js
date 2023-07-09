import { useState, useEffect } from "react";
import Landing from "../inc/Landing";
import Login from "../auth/Login";
import Register from "../auth/Register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Carousel, Divider, message, Alert, Space, Spin, Layout, Typography, Button } from "antd";
import { SmileOutlined, UploadOutlined, SearchOutlined, HomeOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const contentStyle = {
  height: "320px",
  color: "#fff",
  lineHeight: "320px",
  textAlign: "center",
  background: "#364d79",
};

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Guest = () => {
  const [currentPage, setCurrentPage] = useState("Home");
  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Carousel autoplay style={{ background: "#364d79" }}>
        <div style={{ margin: "0px", padding: "0px" }}>
          <h1 style={contentStyle}>ORGANIZATION</h1>
        </div>
        <div>
          <h1 style={contentStyle}>PLANNING</h1>
        </div>
        <div>
          <h1 style={contentStyle}>PRIORITIZATION</h1>
        </div>
        <div>
          <h1 style={contentStyle}>COORDINATION</h1>
        </div>
        <div>
          <h1 style={contentStyle}>EFFICIENY</h1>
        </div>
      </Carousel>
      <Content>
        <div style={{ textAlign: "center", backgroundColor: "", paddingTop: "15px", paddingBottom: "10px" }}>
          <Title style={{ textAlign: "center", marginTop: "0px", padding: "10px" }} level={1}>
            TASK MANAGEMENT
          </Title>
          <Link className="nav-link" to="/">
            <Button
              onClick={() => {
                setCurrentPage("Home");
              }}
              type="dashed"
              icon={<HomeOutlined />}
              style={{ marginRight: "15px" }}></Button>
          </Link>
          <Link className="nav-link" to="/login">
            <Button type="primary" style={{ marginRight: "15px" }}>
              Login
            </Button>
          </Link>
          <Link className="nav-link" to="/register">
            <Button type="dashed" icon={<UserAddOutlined />}></Button>
          </Link>
          <br />
          <Divider orientation="center" orientationMargin="0"></Divider>
        </div>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <Footer
          style={{
            backgroundColor: "white",
            textAlign: "center",
            marginTop: "50px",
          }}>
          Task Manager - ©2023 Created by Royeth M. Rehinaldo
        </Footer>
      </Content>
    </Layout>
  );
};

export default Guest;
