import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../store/userStore.js";

const emptyForm = {
  email: "",
  username: "",
  password: "",
  name: { firstname: "", lastname: "" },
};

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { users, fetchUserById, createUser, updateUser, loading, error, clearError } = useUserStore();

  const found = useMemo(
    () => users.find((u) => String(u.id) === String(id)),
    [users, id]
  );

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const init = async () => {
      if (isEdit) {
        const u = found || (await fetchUserById(id));
        if (u) {
          setForm({
            email: u.email || "",
            username: u.username || "",
            password: "", // never prefill password
            name: { firstname: u.name?.firstname || "", lastname: u.name?.lastname || "" },
          });
        }
      }
    };
    init();
  }, [isEdit, id, found]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstname" || name === "lastname") {
      setForm((f) => ({ ...f, name: { ...f.name, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password || "pass1234", // FakeStore allows any; placeholder if empty
      name: {
        firstname: form.name.firstname.trim(),
        lastname: form.name.lastname.trim(),
      },
    };

    const result = isEdit
      ? await updateUser(id, payload)
      : await createUser(payload);

    if (result) {
      navigate(isEdit ? `/users/${id}` : "/");
    } else {
      alert("Operation failed. Check the error banner.");
    }
  };

  return (
    <section>
      <h2>{isEdit ? "Edit User" : "Create User"}</h2>

      {error && (
        <div className="error" onClick={clearError} role="alert">
          {error} (click to dismiss)
        </div>
      )}

      <form className="form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder={isEdit ? "(leave blank to keep/change server-side)" : ""}
          />
        </label>

        <div className="grid grid-2">
          <label>
            First name
            <input
              name="firstname"
              value={form.name.firstname}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Last name
            <input
              name="lastname"
              value={form.name.lastname}
              onChange={onChange}
              required
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="btn" disabled={loading}>
            {loading ? "Saving…" : isEdit ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </section>
  );
}


