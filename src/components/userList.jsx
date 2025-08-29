import { useEffect } from "react";
import useUserStore from "../store/userStore.js";
import UserCard from "./userCard.jsx";
import { Link } from "react-router-dom";

export default function UserList() {
  const { users, loading, error, fetchUsers, clearError } = useUserStore();

  useEffect(() => {
    if (!users || users.length === 0) fetchUsers();
  }, []);

  return (
    <section>
      <div className="toolbar">
        <h2>All Users</h2>
        <Link to="/users/new" className="btn">+ Add User</Link>
      </div>

      {error && (
        <div className="error" onClick={clearError} role="alert">
          {error} (click to dismiss)
        </div>
      )}

      {loading && <p>Loading users…</p>}

      {!loading && users?.length === 0 && <p>No users yet.</p>}

      <div className="grid">
        {users?.map((u) => <UserCard key={u.id} user={u} />)}
      </div>
    </section>
  );
}


