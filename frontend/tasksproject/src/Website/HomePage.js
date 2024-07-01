import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faUpload, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Select, MenuItem } from "@mui/material";
import "./HomePage.css"; // Import the CSS file
import image from "../Website/to-do-list.jpg";

export default function HomePage() {
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "TO_DO",
  });
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const cookie = new Cookie();
  const token = cookie.get("TaskProject");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/current-user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
    fetchTasks();
  }, [token]);

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", dueDate: "", status: "TO_DO" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/${id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axios.put(
        `http://localhost:8080/api/users/${user.id}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile image uploaded successfully:", response.data);

      setUser((prevUser) => ({
        ...prevUser,
        profileImage: response.data.imageURL,
      }));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const filteredTasks =
    selectedStatus === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === selectedStatus);

  const handleLogout = () => {
    cookie.remove("TaskProject");
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      <div className="user-profile">
        {user.profileImage && (
          <img
            src={`data:image/png;base64,${user.profileImage}`}
            alt="Profile"
          />
        )}
        <div className="user-info">
          <h1>Welcome, {user.username}</h1>
          <h4>Write your tasks Today!</h4>
          <label htmlFor="upload-input" className="upload-label">
            <FontAwesomeIcon icon={faImage} /> Upload profileimage
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            id="upload-input"
          />
          <button onClick={handleImageUpload} className="save-button">
            <FontAwesomeIcon icon={faUpload} /> Save
          </button>
          <br></br>
          <br></br>
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <span className="header"><img src={image}/></span>
        <h2>Tasks</h2>
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="TO_DO">To Do</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
        <ul className="tasks-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-item-content">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <p>Due Date: {task.dueDate}</p>
                  <p>Status: {task.status}</p>
                </div>
                <div>
                  <button
                    onClick={() =>
                      handleUpdateTask(task.id, { ...task, status: "DONE" })
                    }
                    className="complete-button"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="add-task-container">
          <h2>Add New Task</h2>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
            <button onClick={handleAddTask} className="add-task-button">
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}