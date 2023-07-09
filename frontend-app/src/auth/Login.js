import { useState } from "react";
import AuthUser from "./AuthUser";

import { Divider, Row, Col, Spin, Typography, Form, Button, Space, Input, Radio, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const Login = () => {
  const { http, setToken } = AuthUser();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const submitForm = () => {
    // api call
    http.post("/login", { email: email, password: password }).then((res) => {
      setToken(res.data.user, res.data.access_token);
    });
  };

  return (
    <div>
      <Form onFinish={submitForm} style={{ marginTop: "0px", textAlign: "center" }}>
        <Row>
          <Col flex="3"></Col>
          <Col flex="auto">
            <Divider orientation="center" orientationMargin="0">
              LOGIN FORM
            </Divider>
            <Input size="medium" type="email" id="email" required placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            <br />
            <br />
            <Input size="medium" type="password" id="pwd" required placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            <br />
            <br />
            <Button size="medium" block type="primary" htmlType="submit">
              Login
            </Button>
          </Col>
          <Col flex="3"></Col>
        </Row>

        <div style={{ width: "50%" }}></div>
      </Form>
    </div>
  );
};

export default Login;
