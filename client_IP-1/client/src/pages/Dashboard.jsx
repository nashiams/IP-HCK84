import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoistTasks } from "../store/todoistSlice";
import TaskCard from "../components/TaskCard";

export function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.todoist);

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTodoistTasks());
  }, [dispatch]);

  // Styling based on the provided palette
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0d1117", // Very dark gray/black background
      padding: "20px",
      fontFamily: "Roboto, sans-serif",
      color: "#f0f6fc", // Light gray/white text
    },
    header: {
      color: "#58a6ff", // Blue accent for headers
      fontFamily: "Cascadia Code, monospace",
      marginBottom: "30px",
      textAlign: "center",
    },
    card: {
      backgroundColor: "#161b22", // Very dark gray/black for card background
      border: "1px solid #30363d", // Medium gray border
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      marginBottom: "20px",
      color: "#f0f6fc", // Light gray/white text
    },
    cardHeader: {
      backgroundColor: "#21262d", // Medium gray for card header
      borderBottom: "1px solid #30363d",
      padding: "15px 20px",
      fontWeight: "bold",
      fontSize: "1.25rem",
      borderRadius: "8px 8px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardBody: {
      padding: "20px",
    },
    subtaskItem: {
      backgroundColor: "#0d1117", // Darker background for subtask items
      border: "1px solid #21262d", // Medium gray border for subtask
      borderRadius: "5px",
      padding: "10px 15px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      fontSize: "0.95rem",
      gap: "10px", // Space between checkbox and text
    },
    completedSubtask: {
      textDecoration: "line-through",
      color: "#8b949e", // Faded color for completed tasks
    },
    checkbox: {
      accentColor: "#238636", // Green for success states
      width: "18px",
      height: "18px",
    },
    statusText: {
      color: "#58a6ff", // Blue for default status
      fontSize: "0.9rem",
    },
    completedStatus: {
      color: "#2ea043", // Green for completed status
    },
    errorText: {
      color: "#dc4c3e", // Todoist red for error (using previous color for consistency)
      textAlign: "center",
      marginTop: "20px",
    },
    loadingText: {
      color: "#58a6ff",
      textAlign: "center",
      marginTop: "20px",
    },
  };

  if (loading) {
    return (
      <div
        className="container d-flex align-items-center justify-content-center"
        style={styles.container}
      >
        <p className="lead" style={styles.loadingText}>
          Loading tasks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container d-flex align-items-center justify-content-center"
        style={styles.container}
      >
        <p className="lead" style={styles.errorText}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={styles.container}>
      <h1 className="my-4" style={styles.header}>
        Your Todoist Tasks
      </h1>
      <div className="row">
        {tasks.length === 0 ? (
          <div className="col-12">
            <p
              className="lead text-center"
              style={{ color: styles.container.color }}
            >
              No tasks found in the connected Todoist account.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} styles={styles} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
