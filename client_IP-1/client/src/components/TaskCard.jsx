import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTodoistTask,
  deleteTodoistTask,
  completeTodoistTask,
} from "../store/todoistSlice";
import Swal from "sweetalert2";

// TaskCard component receives a single task object and the shared styles object as props

function TaskCard({ task, styles }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );

  const handleSave = () => {
    if (editedContent.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Task content cannot be empty!",
      });
      return;
    }
    dispatch(
      updateTodoistTask({
        taskId: task.id,
        updates: {
          content: editedContent,
          description: editedDescription,
        },
      })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (true) {
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Task deleted successfully!",
      });
      dispatch(deleteTodoistTask(task.id));
    }
  };

  const handleCompleteToggle = () => {
    if (!task.is_completed) {
      dispatch(completeTodoistTask(task.id));
    }
  };

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      {/* <h1>tessssssssssssssss</h1> */}
      <div
        className="card h-100 border-0 shadow-sm"
        style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
        }}
      >
        {/* Card Header */}
        <div
          className="card-header border-0 d-flex align-items-center justify-content-between"
          style={{
            backgroundColor: "#0F0F12",
            borderRadius: "12px 12px 0 0",
            padding: "16px 20px",
            borderBottom: "1px solid #21262d",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="p-2 rounded-2"
              style={{
                backgroundColor: task.is_completed ? "#238636" : "#1f6feb",
                color: "#fff",
              }}
            >
              <i
                className={`bi ${
                  task.is_completed ? "bi-check-circle-fill" : "bi-circle"
                }`}
                style={{ fontSize: "20px" }}
              ></i>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="form-control form-control-sm border-0"
                style={{
                  backgroundColor: "#21262d",
                  color: "#f0f6fc",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              />
            ) : (
              <h6
                className="mb-0"
                style={{
                  color: "#f0f6fc",
                  fontSize: "17px",
                  fontWeight: "600",
                  fontFamily: "Cabin, sans-serif",
                }}
              >
                {task.content}
              </h6>
            )}
          </div>
          {task.is_completed && (
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                backgroundColor: "#238636",
                color: "#fff",
                fontSize: "11px",
              }}
            >
              <i className="bi bi-check-circle me-1"></i>
              Completed
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body" style={{ padding: "20px" }}>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="form-control mb-3 border-0"
              placeholder="Description (optional)"
              rows="3"
              style={{
                backgroundColor: "#21262d",
                color: "#f0f6fc",
                fontSize: "13px",
                resize: "none",
              }}
            ></textarea>
          ) : (
            task.description && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#8b949e",
                  marginBottom: "16px",
                  lineHeight: "1.4",
                }}
              >
                {task.description}
              </p>
            )
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i
                  className="bi bi-list-task"
                  style={{ color: "#8b949e", fontSize: "14px" }}
                ></i>
                <span
                  style={{
                    color: "#f0f6fc",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sub-tasks
                </span>
              </div>
              <div className="d-flex flex-column gap-2">
                {task.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="d-flex align-items-center gap-2 p-2 rounded-2"
                    style={{
                      backgroundColor: "#0d1117",
                      border: "1px solid #21262d",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.is_completed}
                      readOnly
                      className="form-check-input"
                      style={{
                        accentColor: "#238636",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: subtask.is_completed ? "#8b949e" : "#e6edf3",
                        textDecoration: subtask.is_completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {subtask.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Info */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-1">
              <i
                className="bi bi-flag"
                style={{ color: "#8b949e", fontSize: "12px" }}
              ></i>
              <span style={{ fontSize: "11px", color: "#8b949e" }}>
                Priority: {task.priority}
              </span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i
                className="bi bi-info-circle"
                style={{ color: "#8b949e", fontSize: "12px" }}
              ></i>
              <span
                style={{
                  fontSize: "11px",
                  color: task.is_completed ? "#238636" : "#1f6feb",
                }}
              >
                {task.is_completed ? "Completed" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div
          className="card-footer border-0 d-flex justify-content-end gap-2"
          style={{
            backgroundColor: "transparent",
            padding: "12px 20px 20px",
            borderTop: "1px solid #21262d",
          }}
        >
          {isEditing ? (
            <>
              <button
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: "#238636",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                onClick={handleSave}
              >
                <i className="bi bi-check me-1"></i>
                Save
              </button>
              <button
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: "#6e7681",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(task.content);
                  setEditedDescription(task.description || "");
                }}
              >
                <i className="bi bi-x me-1"></i>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: "#1f6feb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-1"></i>
                Edit
              </button>
              <button
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: "#da3633",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </button>
              <button
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: task.is_completed ? "#6e7681" : "#238636",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  opacity: task.is_completed ? 0.6 : 1,
                  cursor: task.is_completed ? "not-allowed" : "pointer",
                  pointerEvents: task.is_completed ? "none" : "auto",
                }}
                onClick={(e) => {
                  e.preventDefault(); // Add this
                  e.stopPropagation(); // Add this
                  handleCompleteToggle();
                }}
                disabled={task.is_completed}
              >
                <i
                  className={`bi ${
                    task.is_completed
                      ? "bi-check-circle-fill"
                      : "bi-check-circle"
                  } me-1`}
                ></i>
                {task.is_completed ? "Completed" : "Complete"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
