import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import "./Global.css";
import "./App.css";

function App() {
  const defaultProfiles = [
    {
      name: "My profile",
      image: "/photo/boss.jpg",
      bio: "Lorem ipsum…"
    }
  ];

  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return defaultProfiles;
  });

  const [form, setForm] = useState({ name: "", image: "", bio: "" });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
        setProfiles(ps => [
      ...ps,
      {
        name: form.name || "Unnamed",
        image: form.image || "/photo/boss.jpg",
        bio: form.bio || ""
      }
    ]);
    setForm({ name: "", image: "", bio: "" });
  };

  useEffect(() => {
    try {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    } catch (e) {
      // ignore
    }
  }, [profiles]);

  const clearSavedProfiles = () => {
    if (!window.confirm('Clear saved profiles? This cannot be undone.')) return;
    try {
      localStorage.removeItem('profiles');
    } catch (e) {
      // ignore
    }
    setProfiles(defaultProfiles);
  };

  return (
    <div className="App">
      <header>
        <h1>Profile App</h1>
      </header>

      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <button type="button" onClick={clearSavedProfiles}>Clear saved profiles</button>
      </div>

      <section id="editor">
        <h2>Edit profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Image URL:
            <input
              type="url"
              name="image"
              placeholder="/photo/boss.jpg"
              value={form.image}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Bio:
            <textarea
              name="bio"
              rows="4"
              value={form.bio}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </section>

      <section id="profiles-list">
        {profiles.map((p, i) => (
          <ProfileCard
            key={i}
            name={p.name}
            image={p.image}
            bio={p.bio}
          />
        ))}
      </section>
    </div>
  );
}

export default App;
