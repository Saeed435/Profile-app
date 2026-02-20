import React, { useState } from "react";
import "./ProfileCard.css";

// ProfileCard component - displays a single profile
// Learn: Presentational component that receives data via props
// Props: name, image, bio, id, onDelete callback function
export default function ProfileCard({ name, image, bio, id, onDelete }) {
  // Learn: Local state for image loading - doesn't need to be in parent
  const [loaded, setLoaded] = useState(true);

  return (
    <div className="profile-card">
      <h2>{name}</h2>
      {loaded && (
        <img
          src={image}
          alt={name}
          onError={() => setLoaded(false)}
          onLoad={() => setLoaded(true)}
        />
      )}
      <p>{bio}</p>
      
      {/* Learn: Conditional rendering - only show delete if id exists */}
      {id && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${name}"?`)) {
              onDelete(id);
            }
          }}
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}