import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Avatar, Card, Carousel, Layout, Divider, Row, Col, Spin, Typography, Form, Button, Space, Input, Radio, message, Upload } from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined, SmileOutlined, UploadOutlined, SearchOutlined, HomeOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const Landing = () => {
  return (
    <div>
      <Row>
        <Col flex="3"></Col>
        <Col flex="6" style={{ textAlign: "center" }}>
          <Divider orientation="center" orientationMargin="0">
            WHAT IS A TASK MANAGEMENT SYSTEM?
          </Divider>
          <div style={{ textAlign: "center" }}>
            <Card style={{ marginBottom: "10px" }}>
              <Paragraph style={{ marginBottom: "0px" }} code={true}>
                Task management refers to the process of organizing and overseeing the various tasks and activities involved in achieving a specific goal or objective. It involves creating a clear plan, assigning responsibilities, setting deadlines, and monitoring progress to ensure that tasks are completed efficiently and effectively.
              </Paragraph>
            </Card>
            <Card style={{ marginBottom: "10px" }}>
              <Paragraph style={{ marginBottom: "0px" }} code>
                Task management is a discipline that involves the systematic approach of identifying, prioritizing, and tracking tasks to ensure that they are completed in a timely manner. It often involves the use of tools and techniques such as to-do lists, project management software, and time management strategies to streamline workflows and optimize productivity.
              </Paragraph>
            </Card>
            <Card style={{ marginBottom: "0px" }}>
              <Paragraph style={{ marginBottom: "0px" }} code>
                Task management is the practice of breaking down complex projects or goals into smaller, manageable tasks, and then coordinating and monitoring the execution of these tasks to achieve the desired outcome. It involves determining the necessary steps, allocating resources, defining milestones, and tracking progress to ensure that the overall project stays on track and meets its objectives. Effective task management helps individuals and teams stay organized, focused, and productive.
              </Paragraph>
            </Card>
          </div>
        </Col>
        <Col flex="3"></Col>
      </Row>
    </div>
  );
};

export default Landing;
