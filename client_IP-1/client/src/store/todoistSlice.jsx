import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios directly

// Helper function to build a hierarchical task structure from a flat array
const buildTaskHierarchy = (tasks) => {
  const taskMap = new Map(
    tasks.map((task) => [task.id, { ...task, subtasks: [] }])
  );
  const rootTasks = [];

  tasks.forEach((task) => {
    if (task.parent_id) {
      // This is a subtask, find its parent and add it to subtasks array
      const parent = taskMap.get(task.parent_id);
      if (parent) {
        parent.subtasks.push(taskMap.get(task.id));
      }
    } else {
      // This is a root task
      rootTasks.push(taskMap.get(task.id));
    }
  });

  // Sort subtasks by their 'order' property within their parent
  rootTasks.forEach((task) => {
    if (task.subtasks.length > 0) {
      task.subtasks.sort((a, b) => a.order - b.order);
    }
  });

  // Sort root tasks by their 'order' property
  rootTasks.sort((a, b) => a.order - b.order);

  return rootTasks;
};

// Async thunk to fetch tasks from your backend's Todoist API
export const fetchTodoistTasks = createAsyncThunk(
  "todoist/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token"); // Get your app's JWT token

      if (!token) {
        return rejectWithValue("Authentication token missing. Please log in.");
      }

      // Directly use axios to call your backend, including the Authorization header
      const response = await axios.get(
        `http://localhost:3000/api/todoist/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Process the flat list into a hierarchical structure before returning
      const hierarchicalTasks = buildTaskHierarchy(response.data);
      return hierarchicalTasks;
    } catch (error) {
      console.error(
        "Error fetching Todoist tasks:",
        error.response?.data || error.message
      );
      // Handle 401 specifically if the backend signals invalid/expired token
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token"); // Clear invalid token
        window.location.href = "/login"; // Redirect to login
        return rejectWithValue(
          "Session expired or invalid. Please log in again."
        );
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Todoist tasks"
      );
    }
  }
);

// Async thunk to update a Todoist task
export const updateTodoistTask = createAsyncThunk(
  "todoist/updateTask",
  async ({ taskId, updates }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return rejectWithValue("Authentication token missing. Please log in.");
      }

      await axios.put(
        `http://localhost:3000/api/todoist/update/${taskId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchTodoistTasks()); // Re-fetch tasks to update UI
      return taskId; // Return ID of updated task
    } catch (error) {
      console.error(
        `Error updating task ${taskId}:`,
        error.response?.data || error.message
      );
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return rejectWithValue(
        error.response?.data?.message || `Failed to update task ${taskId}`
      );
    }
  }
);

// Async thunk to delete a Todoist task
export const deleteTodoistTask = createAsyncThunk(
  "todoist/deleteTask",
  async (taskId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return rejectWithValue("Authentication token missing. Please log in.");
      }

      await axios.delete(`http://localhost:3000/api/todoist/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchTodoistTasks()); // Re-fetch tasks to update UI
      return taskId; // Return ID of deleted task
    } catch (error) {
      console.error(
        `Error deleting task ${taskId}:`,
        error.response?.data || error.message
      );
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return rejectWithValue(
        error.response?.data?.message || `Failed to delete task ${taskId}`
      );
    }
  }
);

// Async thunk to complete a Todoist task
export const completeTodoistTask = createAsyncThunk(
  "todoist/completeTask",
  async (taskId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return rejectWithValue("Authentication token missing. Please log in.");
      }

      await axios.put(
        `http://localhost:3000/api/todoist/complete/${taskId}/`,
        {},
        {
          // Empty body for POST request
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(fetchTodoistTasks()); // Re-fetch tasks to update UI
      return taskId; // Return ID of completed task
    } catch (error) {
      console.error(
        `Error completing task ${taskId}:`,
        error.response?.data || error.message
      );
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return rejectWithValue(
        error.response?.data?.message || `Failed to complete task ${taskId}`
      );
    }
  }
);

const todoistSlice = createSlice({
  name: "todoist",
  initialState: {
    tasks: [], // Stores hierarchical tasks
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers can go here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoistTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodoistTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Store the hierarchical tasks
      })
      .addCase(fetchTodoistTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tasks = []; // Clear tasks on error
      })
      // Add cases for update, delete, complete tasks.
      // We are re-fetching all tasks on success, so no complex local state mutations are needed here.
      .addCase(updateTodoistTask.pending, (state) => {
        state.loading = true; // Set loading state for any API call
        state.error = null;
      })
      .addCase(updateTodoistTask.fulfilled, (state) => {
        state.loading = false;
        // Tasks are re-fetched by fetchTodoistTasks dispatch, no direct state update here
      })
      .addCase(updateTodoistTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodoistTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodoistTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTodoistTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeTodoistTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTodoistTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(completeTodoistTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default todoistSlice.reducer;
