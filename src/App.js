import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import "./Global.css";
import "./App.css";

// Main App component using React hooks for state management
// Learn: useState creates reactive state, useEffect handles side effects
function App() {
  const defaultProfiles = [
    {
      name: "My profile",
      image: "/photo/boss.jpg",
      bio: "Lorem ipsum…"
    }
  ];

  // Learn: useState with initializer function (lazy initialization)
  // This only runs once on mount, loading from localStorage
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return defaultProfiles;
  });

  // Learn: useState for form state - each field is part of one object
  // This makes it easy to reset the form and track related data
  const [form, setForm] = useState({ name: "", image: "", bio: "" });
  
  // Learn: State for search query to filter profiles
  const [search, setSearch] = useState("");
  
  // Learn: State for form validation errors
  const [errors, setErrors] = useState({});

  // Learn: Controlled component pattern - input value comes from state
  // This allows React to control the form input behavior
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(err => ({ ...err, [name]: "" }));
    }
  };

  // Learn: Form validation - check required fields and URL format
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.image.trim()) newErrors.image = "Image URL is required";
    else if (!form.image.startsWith("/") && !form.image.startsWith("http")) {
      newErrors.image = "URL should start with / or http";
    }
    return newErrors;
  };

  // Learn: Form submission with validation
  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate before adding
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Learn: Immutable state update - creates new array, doesn't mutate original
    setProfiles(ps => [
      ...ps,
      {
        id: Date.now(), // Simple unique ID
        name: form.name.trim(),
        image: form.image.trim(),
        bio: form.bio.trim()
      }
    ]);
    setForm({ name: "", image: "", bio: "" });
    setErrors({});
  };

  // Learn: useEffect side effect - synchronizes state with localStorage
  // The dependency array [profiles] means this runs whenever profiles changes
  useEffect(() => {
    try {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    } catch (e) {
      // ignore
    }
  }, [profiles]);
  
  // Learn: Filtering and searching - functional approach
  // Returns only profiles whose name contains the search term (case-insensitive)
  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
              placeholder="Enter profile name"
            />
            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
          </label>

          <label>
            Image URL:
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="/photo/boss.jpg or https://..."
            />
            {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
          </label>

          <label>
            Bio:
            <textarea
              name="bio"
              rows="4"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about this profile"
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </section>
      
      {/* Learn: Conditional rendering - only show search if there are profiles */}
      {profiles.length > 0 && (
        <section style={{ maxWidth: 640, margin: '0 auto 24px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #dfe6ef',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }}
          />
          <p style={{ marginTop: 8, fontSize: '0.9em', color: '#666' }}>
            Found {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''}
          </p>
        </section>
      )}

      {/* Learn: Conditional rendering with map() - render filtered results */}
      <section id="profiles-list">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((p) => (
            <ProfileCard
              key={p.id || p.name}
              id={p.id}
              name={p.name}
              image={p.image}
              bio={p.bio}
              onDelete={(id) => {
                // Learn: Filter removes the deleted profile from state
                setProfiles(ps => ps.filter(profile => profile.id !== id));
              }}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>
            {search ? 'No profiles match your search' : 'No profiles yet. Add one to get started!'}
          </p>
        )}
      </section>
    </div>
  );
}

export default App;
