import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "../auth/Login";
import ChoreList from "../chores/ChoreList";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <ChoreList /> }],
  },
]);
