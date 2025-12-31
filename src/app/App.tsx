import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <main>
      <h1>Chore Monkey</h1>
      <Outlet />
    </main>
  );
}
