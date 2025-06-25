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
        // If no token, user is not authenticated with your app.
        // Redirect to login or handle as unauthorized.
        // For now, we'll reject with a specific message.
        // In a real app, you might trigger a redirect here: window.location.href = '/login';
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
      });
  },
});

export default todoistSlice.reducer;
