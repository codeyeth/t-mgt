import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

import { Divider, Row, Col, Form, Button, Input, message } from "antd";

const Register = () => {
  const navigate = useNavigate();
  const { http, setToken } = AuthUser();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [messageApi, contextHolder] = message.useMessage();

  const successMessage = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const errorMessage = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const submitForm = () => {
    // api call
    http
      .post("/register", { email: email, password: password, name: name })
      .then((res) => {
        successMessage("Registered Successfully. Redirecting you to Login.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Error occured.");
      });
  };

  return (
    <div className="row justify-content-left pt-5">
      {contextHolder}
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
      </Form>
    </div>
  );
};

export default Register;
