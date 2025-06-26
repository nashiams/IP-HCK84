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

  // Handle saving edits
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
    setIsEditing(false); // Exit edit mode
  };

  // Handle deleting a task
  const handleDelete = () => {
    if (true) {
      // Using confirm for simplicity
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Task deleted successfully!",
      });
      dispatch(deleteTodoistTask(task.id));
    }
  };

  // Handle completing a task via checkbox
  const handleCompleteToggle = () => {
    // Only allow completing if the task is not already completed
    if (!task.is_completed) {
      dispatch(completeTodoistTask(task.id));
    }
    // If it's already completed, do nothing (as we don't have a reopen UI/API route here)
  };

  return (
    <div className="col-12 col-md-6 col-lg-4 d-flex">
      {" "}
      {/* Flex for equal height cards */}
      <div className="card w-100" style={styles.card}>
        <div className="card-header" style={styles.cardHeader}>
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="form-control"
              style={{
                backgroundColor: styles.subtaskItem.backgroundColor,
                color: styles.container.color,
                borderColor: styles.card.border,
              }}
            />
          ) : (
            <span>{task.content}</span>
          )}
          {task.project_id && (
            <span style={styles.statusText}>Project: {task.project_id}</span>
          )}
        </div>
        <div className="card-body" style={styles.cardBody}>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="form-control mb-3"
              placeholder="Description (optional)"
              rows="3"
              style={{
                backgroundColor: styles.subtaskItem.backgroundColor,
                color: styles.container.color,
                borderColor: styles.card.border,
              }}
            ></textarea>
          ) : (
            task.description && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#e6edf3",
                  marginBottom: "15px",
                }}
              >
                {task.description}
              </p>
            )
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="subtasks-list">
              <h6
                style={{
                  color: "#f0f6fc",
                  marginBottom: "10px",
                  fontSize: "1rem",
                }}
              >
                Sub-tasks:
              </h6>
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} style={styles.subtaskItem}>
                  <input
                    type="checkbox"
                    checked={subtask.is_completed}
                    readOnly // Subtasks cannot be completed directly from this UI, only main tasks
                    style={styles.checkbox}
                  />
                  <span
                    style={subtask.is_completed ? styles.completedSubtask : {}}
                  >
                    {subtask.content}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem",
              color: "#e6edf3",
            }}
          >
            <span>Priority: {task.priority}</span>
            <span
              style={
                task.is_completed ? styles.completedStatus : styles.statusText
              }
            >
              Status: {task.is_completed ? "Completed" : "Active"}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            {isEditing ? (
              <>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: styles.completedStatus.color,
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: styles.statusText.color,
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(task.content); // Reset content on cancel
                    setEditedDescription(task.description || ""); // Reset description on cancel
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: styles.statusText.color,
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: styles.errorText.color,
                    color: "#fff",
                    borderRadius: "5px",
                  }}
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: task.is_completed
                      ? "#8b949e"
                      : styles.checkbox.accentColor,
                    color: "#fff",
                    borderRadius: "5px",
                    opacity: task.is_completed ? 0.6 : 1, // Visually indicate disabled if completed
                    cursor: task.is_completed ? "not-allowed" : "pointer",
                  }}
                  onClick={handleCompleteToggle}
                  disabled={task.is_completed} // Disable if already completed
                >
                  {task.is_completed ? "Completed" : "Complete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
