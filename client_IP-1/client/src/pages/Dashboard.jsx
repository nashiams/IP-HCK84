import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodoistTasks } from "../store/todoistSlice";
import TaskCard from "../components/TaskCard";

export function Dashboard() {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.todoist);

  useEffect(() => {
    if (tasks.length === 0 && !loading && !error) {
      dispatch(fetchTodoistTasks());
    }
  }, [dispatch, tasks.length, loading, error]);

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0F0F12",
      padding: "24px",
      fontFamily: "Cabin, sans-serif",
      color: "#f0f6fc",
    },
    header: {
      color: "#f0f6fc",
      fontFamily: "Cabin, sans-serif",
      marginBottom: "32px",
      textAlign: "left",
      fontWeight: "700",
      fontSize: "28px",
    },
    card: {
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
      marginBottom: "24px",
      color: "#f0f6fc",
    },
    cardHeader: {
      backgroundColor: "#0F0F12",
      borderBottom: "1px solid #21262d",
      padding: "16px 20px",
      fontWeight: "600",
      fontSize: "16px",
      borderRadius: "12px 12px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardBody: {
      padding: "20px",
    },
    subtaskItem: {
      backgroundColor: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "6px",
      padding: "12px 16px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      gap: "12px",
    },
    completedSubtask: {
      textDecoration: "line-through",
      color: "#8b949e",
    },
    checkbox: {
      accentColor: "#238636",
      width: "16px",
      height: "16px",
    },
    statusText: {
      color: "#1f6feb",
      fontSize: "15px",
    },
    completedStatus: {
      color: "#238636",
    },
    errorText: {
      color: "#da3633",
      textAlign: "center",
      marginTop: "40px",
    },
    loadingText: {
      color: "#1f6feb",
      textAlign: "center",
      marginTop: "40px",
    },
  };

  if (loading) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <div
          className="container-fluid d-flex align-items-center justify-content-center"
          style={styles.container}
        >
          <div className="text-center">
            <div
              className="spinner-border mb-3"
              style={{ color: "#1f6feb" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="lead" style={styles.loadingText}>
              Loading tasks...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <div
          className="container-fluid d-flex align-items-center justify-content-center"
          style={styles.container}
        >
          <div className="text-center">
            <i
              className="bi bi-exclamation-triangle mb-3"
              style={{ fontSize: "48px", color: "#da3633" }}
            ></i>
            <p className="lead" style={styles.errorText}>
              Error: {error}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cabin:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="container-fluid" style={styles.container}>
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 style={styles.header}>
              <i className="bi bi-kanban me-3" style={{ color: "#1f6feb" }}></i>
              Your Todoist Tasks
            </h1>
            <p style={{ color: "#8b949e", fontSize: "14px", margin: 0 }}>
              Manage and track your tasks efficiently
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "12px", color: "#8b949e" }}>
              Total Tasks: {tasks.length}
            </span>
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                backgroundColor: "#238636",
                fontSize: "11px",
              }}
            >
              {tasks.filter((task) => task.is_completed).length} Completed
            </span>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="row">
          {tasks.length === 0 ? (
            <div className="col-12">
              <div
                className="card border-0 text-center py-5"
                style={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "12px",
                }}
              >
                <div className="card-body">
                  <i
                    className="bi bi-inbox mb-3"
                    style={{ fontSize: "48px", color: "#6e7681" }}
                  ></i>
                  <h5
                    style={{
                      color: "#f0f6fc",
                      fontFamily: "Cabin, sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    No tasks found
                  </h5>
                  <p style={{ color: "#8b949e", fontSize: "14px" }}>
                    No tasks found in the connected Todoist account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} styles={styles} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
