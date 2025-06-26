import { Provider } from "react-redux";

import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { store } from "./store/main";
import CodeChecker from "./pages/CodeChecker";
import AuthLayout from "./layout/AuthLayout";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          {/* <Route element={<} */}

          <Route element={<AuthLayout />}>
            <Route element={<Dashboard />} path="/" />
            <Route element={<CodeChecker />} path="/check-code" />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
