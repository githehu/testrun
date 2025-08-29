import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore.js";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, deleteUser, loading, error, clearError, users } = useUserStore();
  const [user, setUser] = useState(() => users.find((u) => String(u.id) === String(id)));

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const u = await fetchUserById(id);
      if (!ignore) setUser(u);
    };
    if (!user) load();
    return () => { ignore = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete ${user?.username}?`)) return;
    const ok = await deleteUser(id);
    if (ok) navigate("/");
  };

  if (loading && !user) return <p>Loading…</p>;
  if (error) return <div className="error" onClick={clearError}>{error}</div>;
  if (!user) return <p>Not found.</p>;

  return (
    <section>
      <div className="toolbar">
        <h2>User #{user.id}</h2>
        <div className="gap">
          <Link to={`/users/${user.id}/edit`} className="btn secondary">Edit</Link>
          <button className="btn danger" onClick={handleDelete} disabled={loading}>
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="panel">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Name:</strong> {user.name?.firstname} {user.name?.lastname}</p>
      </div>

      <Link to="/" className="link">← Back to users</Link>
    </section>
  );
}


