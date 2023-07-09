import { Spin, Descriptions, Badge, Typography, Modal, Form, Input, Button, Space, Table, Tag, List, Skeleton, Avatar, Popconfirm, Col, Row, Select, Divider } from "antd";
import Moment from "moment";
const { Title, Text } = Typography;

const TaskModal = ({ open, modalLoading, confirm, cancel, setOpen, modalContent, imagesData, subTaskData, closeModal }) => {
  return (
    <div>
      <Modal
        title={modalContent && modalContent.task.toUpperCase()}
        centered
        open={open}
        onCancel={closeModal}
        footer={[
          <Button key="button" type="primary" onClick={() => closeModal()}>
            Close
          </Button>,
        ]}
        width={1000}>
        {/* close */}
        <div style={{ transition: "opacity 5s ease" }}>
          <Divider orientation="right" orientationMargin="0">
            Task Information
          </Divider>
          {modalLoading && (
            <div>
              <Skeleton active />
            </div>
          )}
          {modalContent && !modalLoading && (
            <Descriptions bordered={true} column={{ xs: 1, sm: 1, md: 1 }}>
              <Descriptions.Item label="ID">{modalContent.id}</Descriptions.Item>
              <Descriptions.Item label="Task">{<b>{modalContent.task.toUpperCase()}</b>}</Descriptions.Item>
              <Descriptions.Item label="Type">
                {" "}
                {!modalContent.is_sub_task && <Tag color="purple">maintask</Tag>}
                {modalContent.is_sub_task == true && <Tag color="magenta">subtask of {modalContent.main_task_id}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {modalContent.status == "todo" && <Tag color="orange">{modalContent.status.toUpperCase()}</Tag>}
                {modalContent.status == "inprogress" && <Tag color="cyan">{modalContent.status.toUpperCase()}</Tag>}
                {modalContent.status == "completed" && <Tag color="green">{modalContent.status.toUpperCase()}</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Created at">{Moment(modalContent.created_at).format("MMM DD, Y h:mm a")}</Descriptions.Item>
              <Descriptions.Item label="Images">
                {!imagesData && (
                  <Text type="warning" italic>
                    No Images found...
                  </Text>
                )}{" "}
                {imagesData &&
                  imagesData.map((item) => (
                    <Popconfirm key={item.id} title="Delete the Image" description="Are you sure to delete this Image?" onConfirm={() => confirm(item.id, "deleteImage")} onCancel={cancel} okText="Yes" cancelText="No">
                      <Avatar size={64} src={`http://127.0.0.1:8000/storage/taskimages/${item.filename}`}></Avatar>
                    </Popconfirm>
                  ))}
              </Descriptions.Item>
              {subTaskData && <span>Sub-Task/s</span>}
              {subTaskData &&
                subTaskData.map((item) => (
                  <Descriptions.Item
                    key={item.id}
                    label={
                      <b>
                        {item.id}. {item.task.toUpperCase()}
                      </b>
                    }>
                    {item.status == "todo" && <Tag color="orange">{item.status.toUpperCase()}</Tag>}
                    {item.status == "inprogress" && <Tag color="cyan">{item.status.toUpperCase()}</Tag>}
                    {item.status == "completed" && <Tag color="green">{item.status.toUpperCase()}</Tag>}
                    {Moment(item.created_at).format("MMM DD, Y h:mm a")}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TaskModal;
