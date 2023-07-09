import { Spin, Typography, Form, Button, Space, Input, Radio, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Text } = Typography;

const TaskCreate = ({ taskImage, setTaskImage, isSaving, parentTask, isSubTask, setIsSubTask, task, setTask, taskStat, setTaskStat, isUpdate, updateTask, clearUpdate, saveTask }) => {
  const handleSubmit = async (e) => {
    if (!isUpdate) {
      saveTask();
    } else {
      updateTask();
    }
  };

  const props = {
    multiple: true,
    onRemove: (file) => {
      const index = taskImage.indexOf(file);
      const newFileList = taskImage.slice();
      newFileList.splice(index, 1);
      setTaskImage(newFileList);
    },
    beforeUpload: (file) => {
      const isPNG = file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg";
      if (!isPNG) {
        message.error(`${file.name} is not a image file`);
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (file) => {
      // setTaskImage([...taskImage, file]);
      setTaskImage(file.fileList);
      return false;
    },
    taskImage,
  };

  return (
    <div>
      {isSaving && (
        <div style={{ textAlign: "center" }}>
          <Spin />
        </div>
      )}

      {!isSaving && (
        <Form onFinish={handleSubmit}>
          {task && (
            <div style={{ marginBottom: "10px" }}>
              <Text type="default" italic>
                Max Characters <u>{task.length}</u> / 50
              </Text>
            </div>
          )}
          <Space.Compact block>
            <Input size="large" required placeholder="Do the dishes" value={task} onChange={(e) => setTask(e.target.value)} maxLength={50} />
            <Button size="large" type="primary" htmlType="submit">
              {isUpdate && "Update"}
              {!isUpdate && "Save"}
            </Button>
            {isUpdate && (
              <Button
                size="large"
                type="primary"
                danger
                onClick={() => {
                  clearUpdate();
                }}>
                Cancel
              </Button>
            )}
          </Space.Compact>
          <br />
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select Image to Upload</Button>
          </Upload>
          {isSubTask && (
            <Text type="default" italic>
              You are about to Create a Sub-Task for{" "}
              <u>
                {parentTask.id} : {parentTask.task.toUpperCase()}
              </u>
            </Text>
          )}
          {isSubTask && (
            <Button
              type="link"
              danger
              onClick={() => {
                setIsSubTask(false);
              }}>
              <Text type="danger" italic underline>
                Cancel
              </Text>
            </Button>
          )}
          {isUpdate && <br />}
          {isUpdate && (
            <Radio.Group
              onChange={(e) => {
                setTaskStat(e.target.value);
              }}
              value={taskStat}>
              <Radio value={"todo"}>Todo</Radio>
              <Radio value={"inprogress"}>In Progress</Radio>
              <Radio value={"completed"}>Completed</Radio>
            </Radio.Group>
          )}
        </Form>
      )}
    </div>
  );
};

export default TaskCreate;
