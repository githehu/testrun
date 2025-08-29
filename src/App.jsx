import { Routes, Route, Link, NavLink } from "react-router-dom";
import UserList from "./components/userList.jsx";
import UserDetail from "./components/userDetail.jsx";
import UserForm from "./components/userForm.jsx";

export default function App() {
  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="brand">FakeStore Users</Link>
        <nav className="nav">
          <NavLink to="/" end>Users</NavLink>
          <NavLink to="/users/new">Add User</NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
          <Route path="*" element={<p>Not Found</p>} />
        </Routes>
      </main>

      <footer className="footer">
        <small>Githehu</small>
      </footer>
    </div>
  );
}


