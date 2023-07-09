import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

import { Divider, Row, Col, Spin, Typography, Form, Button, Space, Input, Radio, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { http, setToken } = AuthUser();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const submitForm = () => {
    // api call
    http.post("/register", { email: email, password: password, name: name }).then((res) => {
      navigate("/login");
    });
  };

  return (
    <div className="row justify-content-left pt-5">
      <Form onFinish={submitForm} style={{ marginTop: "0px", textAlign: "center" }}>
        <Row>
          <Col flex="3"></Col>
          <Col flex="auto">
            <Divider orientation="center" orientationMargin="0">
              REGISTER FORM
            </Divider>
            <Input size="medium" type="text" id="name" required placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
            <br />
            <br />
            <Input size="medium" type="email" id="email" required placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            <br />
            <br />
            <Input size="medium" type="password" id="pwd" required placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            <br />
            <br />
            <Button size="medium" block type="primary" htmlType="submit">
              Submit
            </Button>
          </Col>
          <Col flex="3"></Col>
        </Row>

        <div style={{ width: "50%" }}></div>
      </Form>
    </div>
  );
};

export default Register;
