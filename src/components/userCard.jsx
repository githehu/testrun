import { Link } from "react-router-dom";
import useUserStore from "../store/userStore.js";

export default function UserCard({ user }) {
  const deleteUser = useUserStore((s) => s.deleteUser);
  const loading = useUserStore((s) => s.loading);

  const handleDelete = async () => {
    if (!confirm(`Delete ${user.username}?`)) return;
    const ok = await deleteUser(user.id);
    if (!ok) alert("Delete failed. Check the error banner.");
  };

  return (
    <article className="card">
      <div className="card-main">
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        <p>
          {user.name?.firstname} {user.name?.lastname}
        </p>
      </div>
      <div className="card-actions">
        <Link className="btn" to={`/users/${user.id}`}>View</Link>
        <Link className="btn secondary" to={`/users/${user.id}/edit`}>Edit</Link>
        <button className="btn danger" onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Delete"}
        </button>
      </div>
    </article>
  );
}


