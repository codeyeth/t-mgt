import { useEffect, useState } from "react";
import { Typography, Modal, Form, Input, Button, Space, Table, Tag, List, Skeleton, Avatar, Popconfirm, Grid, Col, Row, Select, Divider } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import Moment from "moment";
import { useDebounce } from "@uidotdev/usehooks";
import TaskModal from "./TaskModal";
const { useBreakpoint } = Grid;

const TaskList = ({ getSubTask, getImage, open, setOpen, modalContent, setModalContent, subTaskData, setSubTaskData, modalLoading, setModalLoading, imagesData, setImagesData, deleteImage, updateTask, tasks, parentTask, setParentTask, isSubTask, setIsSubTask, search, setSearch, sort, setSort, getTasks, editTask, deleteTask, isUpdate, updateId, clearUpdate, isTrash, setIsTrash, permaDeleteTask, listLoading, setListLoading }) => {
  const { Title, Text } = Typography;
  const [input, setInput] = useState(null);
  const debouncedSearchTerm = useDebounce(input, 300);
  const screens = useBreakpoint();

  const confirm = (id, mode) => {
    if (id) {
      if (mode == "delete") {
        deleteTask(id);
      }
      if (mode == "restore") {
        updateTask(id);
      }
      if (mode == "deleteImage") {
        deleteImage(id);
      }
    }
  };

  const cancel = (e) => {
    console.log("operation cancelled");
  };

  const openModal = async (itemDetails) => {
    setOpen(true);
    setModalContent(itemDetails);
    setModalLoading(true);
    getSubTask(itemDetails.id);
    getImage(itemDetails.id);
  };

  const closeModal = () => {
    setOpen(false);
    setModalContent(null);
    setSubTaskData(null);
    setImagesData(null);
  };

  const style = {
    padding: "8px 0",
  };

  const insertSubTaskDetails = (value) => {
    setIsSubTask(true);
    setParentTask(value);
  };

  useEffect(() => {
    setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div>
      {/* {JSON.stringify(screens)} */}
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}>
        <Col flex="6">
          <div style={style}>
            <Input size="medium" placeholder="Search" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
        </Col>
        <Col flex="3">
          <div style={style}>
            <Select
              defaultValue="DESC"
              style={{
                width: 130,
              }}
              onChange={(value) => {
                setSort(value);
              }}
              options={[
                {
                  value: "DESC",
                  label: "Latest on top",
                },
                {
                  value: "ASC",
                  label: "Oldest on top",
                },
              ]}
            />
          </div>
        </Col>
        <Col flex="3">
          <div style={{ padding: "8px 0", textAlign: "right" }}>
            {!isTrash && (
              <Button
                shape="square"
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsTrash(true);
                }}>
                Trash
              </Button>
            )}
            {isTrash && (
              <Button
                shape="square"
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsTrash(false);
                }}>
                Exit Trash
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {tasks.length > 0 && isTrash && (
        <Popconfirm title="Delete the task" description="Really empty trash?" onConfirm={() => permaDeleteTask()} onCancel={cancel} okText="Yes" cancelText="No">
          <Button block style={{ marginTop: "10px", marginBottom: "10px" }} danger shape="square" type="primary" icon={<DeleteOutlined />}>
            Empty the Trash
          </Button>
        </Popconfirm>
      )}

      <List
        itemLayout="horizontal"
        pagination
        loading={listLoading}
        dataSource={tasks}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={screens.md && <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
              title={
                <Button style={{ padding: "0px" }} type="link" danger onClick={() => openModal(item)}>
                  <Text>
                    {item.id}. {!screens.md && <b>{item.task.toUpperCase().substring(0, 10)}...</b>} {screens.md && <b>{item.task.toUpperCase()}</b>}
                  </Text>
                  {!item.is_sub_task && (
                    <Tag style={{ marginLeft: "10px" }} color="purple">
                      maintask
                    </Tag>
                  )}
                  {item.is_sub_task == true && (
                    <Tag style={{ marginLeft: "10px" }} color="magenta">
                      subtask of #{item.main_task_id}
                    </Tag>
                  )}
                  <span style={{ margin: "0px 5px" }}>
                    {item.status == "todo" && <Tag color="orange">{item.status.toLowerCase()}</Tag>}
                    {item.status == "inprogress" && <Tag color="cyan">{item.status.toLowerCase()}</Tag>}
                    {item.status == "completed" && <Tag color="green">{item.status.toLowerCase()}</Tag>}
                  </span>
                </Button>
              }
              description={Moment(item.created_at).format("MMM DD, Y h:mm a")}
            />
            <div style={{ display: "flex", marginTop: screens.xs ? "50px" : "" }}>
              {!isUpdate && !item.is_deleted && !item.is_sub_task && <Button shape="circle" type="primary" icon={<PlusOutlined />} onClick={() => insertSubTaskDetails(item)}></Button>}
              <div style={{ margin: "0px 5px" }}>
                {updateId != item.id && !item.is_deleted && <Button shape="circle" type="primary" icon={<EditOutlined />} onClick={() => editTask(item.id)}></Button>}
                {updateId == item.id && <Button shape="circle" type="primary" danger icon={<CloseOutlined />} onClick={() => clearUpdate()}></Button>}
              </div>
              {isTrash && (
                <Popconfirm title="Restore the Deleted Task" description="Are you sure to restore this deleted task?" onConfirm={() => confirm(item.id, "restore")} onCancel={cancel} okText="Yes" cancelText="No">
                  <Button style={{ marginRight: "5px" }} shape="circle" type="primary" icon={<ReloadOutlined />}></Button>
                </Popconfirm>
              )}
              <Popconfirm title="Delete the task" description="Are you sure to delete this task?" onConfirm={() => confirm(item.id, "delete")} onCancel={cancel} okText="Yes" cancelText="No">
                <Button shape="circle" type="primary" danger icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </div>
          </List.Item>
        )}
      />

      <TaskModal open={open} confirm={confirm} cancel={cancel} modalLoading={modalLoading} closeModal={closeModal} imagesData={imagesData} subTaskData={subTaskData} setOpen={setOpen} modalContent={modalContent} />
    </div>
  );
};

export default TaskList;
