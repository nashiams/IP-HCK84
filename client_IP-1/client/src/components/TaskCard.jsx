import React from "react";

// TaskCard component receives a single task object and the shared styles object as props
function TaskCard({ task, styles }) {
  return (
    <div className="col-12 col-md-6 col-lg-4 d-flex">
      {" "}
      {/* Flex for equal height cards */}
      <div className="card w-100" style={styles.card}>
        <div className="card-header" style={styles.cardHeader}>
          <span>{task.content}</span>
          {/* Display project_id if available */}
          {task.project_id && (
            <span style={styles.statusText}>Project: {task.project_id}</span>
          )}
        </div>
        <div className="card-body" style={styles.cardBody}>
          {task.description && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "#e6edf3",
                marginBottom: "15px",
              }}
            >
              {task.description}
            </p>
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
                    readOnly // Tasks are completed via backend interaction
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
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
