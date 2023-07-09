import { useEffect, useState } from "react";
import TaskCreate from "./TaskCreate";
import TaskList from "./TaskList";
import { Divider, message, Alert, Space, Spin, Layout } from "antd";
import axios from "axios";

const Task = ({ userDetails }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState("DESC");
  const [isTrash, setIsTrash] = useState(false);
  const [isSubTask, setIsSubTask] = useState(false);
  const [parentTask, setParentTask] = useState([]);
  const [task, setTask] = useState(null);
  const [taskStat, setTaskStat] = useState("todo");
  const [taskImage, setTaskImage] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [subTaskData, setSubTaskData] = useState(null);
  const [imagesData, setImagesData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { Content, Footer } = Layout;
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

  const saveTask = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("task", task);
    formData.append("is_sub_task", isSubTask);
    formData.append("cby_id", userDetails.id);
    formData.append("cby_name", userDetails.name);
    if (taskImage) {
      taskImage.forEach((image) => {
        formData.append("image[]", image.originFileObj);
      });
    }
    if (parentTask.id == undefined) {
      formData.append("main_task_id", null);
    } else {
      formData.append("main_task_id", parentTask.id);
    }
    const response = await axios.post("http://127.0.0.1:8000/api/save-task", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status == 200) {
      getTasks();
      setTask(null);
      successMessage(response.data.message);
      setIsSubTask(false);
      setParentTask([]);
      setIsSaving(false);
      setTaskImage([]);
    } else {
      console.log(response);
    }
  };

  const getTasks = async () => {
    if (search !== null && search.length == 0) {
      var searchQuery = null;
    } else {
      var searchQuery = search;
    }

    setListLoading(true);
    await fetch("http://localhost:8000/api/tasks/" + userDetails.id + "/" + sort + "/" + searchQuery + "/" + isTrash, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("something went wrong.");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data.tasks);
        setIsPending(false);
        setListLoading(false);
        setError(null);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  };

  const editTask = async (id) => {
    setIsSaving(true);
    setIsSubTask(false);
    setParentTask([]);
    setTaskImage([]);
    setTimeout(() => {
      setIsSaving(false);
    }, 100);
    try {
      await axios.get("http://127.0.0.1:8000/api/task/" + id).then(function (data) {
        setIsUpdate(true);
        setUpdateId(id);
        setTask(data.data.task.task);
        setTaskStat(data.data.task.status);
        setTaskImage([]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (id = null) => {
    setIsSaving(true);
    if (id) {
      var uId = id;
      var mode = "restore";
    } else {
      var uId = updateId;
      var mode = "update";
    }
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("task", task);
    formData.append("status", taskStat);
    formData.append("mode", mode);
    if (taskImage) {
      taskImage.forEach((image) => {
        formData.append("image[]", image.originFileObj);
      });
    }
    try {
      await axios
        .post("http://127.0.0.1:8000/api/update-task/" + uId, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          getTasks();
          setIsPending(false);
          setError(null);
          setTask(null);
          setTaskStat("todo");
          setIsUpdate(false);
          setUpdateId(null);
          setIsSaving(false);
          setTaskImage([]);
          successMessage(data.data.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const clearUpdate = () => {
    setIsSaving(true);
    setTask(null);
    setTaskStat("todo");
    setIsUpdate(false);
    setUpdateId(null);
    setTaskImage(null);
    errorMessage("Operation cancelled");
    setTimeout(() => {
      setIsSaving(false);
    }, 100);
  };

  const deleteTask = async (id) => {
    const formData = new FormData();
    if (!isTrash) {
      formData.append("_method", "PUT");
    } else {
      formData.append("_method", "DELETE");
    }
    try {
      await axios
        .post("http://127.0.0.1:8000/api/delete-task/" + id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          getTasks();
          setIsPending(false);
          setError(null);
          successMessage(data.data.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const permaDeleteTask = async () => {
    try {
      await axios
        .delete("http://127.0.0.1:8000/api/perma-delete-task/", {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          getTasks();
          setIsPending(false);
          setError(null);
          successMessage(data.data.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getSubTask = async (id) => {
    if (isUpdate) {
      clearUpdate();
    }
    try {
      await axios.get("http://127.0.0.1:8000/api/subtask/" + id).then(function (data) {
        setSubTaskData(null);
        if (data.data.task.length) {
          setSubTaskData(data.data.task);
        }
        setTimeout(() => {
          setModalLoading(false);
        }, 200);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getImage = async (id) => {
    try {
      await axios.get("http://127.0.0.1:8000/api/get-image/" + id).then(function (data) {
        setImagesData(null);
        if (data.data.images.length) {
          setImagesData(data.data.images);
        }
      });
      setTimeout(() => {
        setModalLoading(false);
      }, 200);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImage = async (id) => {
    setModalLoading(true);
    const formData = new FormData();
    formData.append("_method", "DELETE");
    try {
      await axios
        .post("http://127.0.0.1:8000/api/delete-image/" + id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          successMessage(data.data.message);
          getImage(data.data.taskId);
          setModalLoading(false);
        });
    } catch (err) {
      console.log(err);
      errorMessage(err.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, [sort, search, isTrash]);

  return (
    <div>
      <Layout style={{ backgroundColor: "white" }}>
        <Content style={{ padding: "10px 20px" }}>
          {contextHolder}
          <TaskCreate taskImage={taskImage} setTaskImage={setTaskImage} isSaving={isSaving} saveTask={saveTask} getTasks={getTasks} parentTask={parentTask} setParentTask={setParentTask} task={task} setTask={setTask} taskStat={taskStat} setTaskStat={setTaskStat} isUpdate={isUpdate} updateTask={updateTask} successMessage={successMessage} clearUpdate={clearUpdate} isSubTask={isSubTask} setIsSubTask={setIsSubTask} />
          <Divider orientationMargin="0">
            {!isTrash && "Task List"}
            {isTrash && "Task Trash"}
          </Divider>

          {isPending && (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          )}

          <Space direction="vertical" style={{ width: "100%" }}>
            {error && <Alert message="Something went wrong." type="error" />}
          </Space>

          {!isPending && tasks && (
            <TaskList
              setUpdateId={setUpdateId}
              setIsUpdate={setIsUpdate}
              getImage={getImage}
              getSubTask={getSubTask}
              deleteImage={deleteImage}
              modalLoading={modalLoading}
              setModalLoading={setModalLoading}
              open={open}
              setOpen={setOpen}
              modalContent={modalContent}
              setModalContent={setModalContent}
              subTaskData={subTaskData}
              setSubTaskData={setSubTaskData}
              imagesData={imagesData}
              setImagesData={setImagesData}
              updateTask={updateTask}
              search={search}
              parentTask={parentTask}
              setParentTask={setParentTask}
              setSearch={setSearch}
              sort={sort}
              setSort={setSort}
              tasks={tasks}
              getTasks={getTasks}
              deleteTask={deleteTask}
              editTask={editTask}
              isUpdate={isUpdate}
              updateId={updateId}
              clearUpdate={clearUpdate}
              isTrash={isTrash}
              setIsTrash={setIsTrash}
              permaDeleteTask={permaDeleteTask}
              listLoading={listLoading}
              setListLoading={setListLoading}
              isSubTask={isSubTask}
              setIsSubTask={setIsSubTask}
            />
          )}

          <Divider />
          <Footer
            style={{
              backgroundColor: "white",
              textAlign: "center",
            }}>
            Task Manager - ©2023 Created by Royeth M. Rehinaldo
          </Footer>
        </Content>
      </Layout>
    </div>
  );
};

export default Task;
