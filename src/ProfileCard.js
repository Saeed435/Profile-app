import React, { useState } from "react";
import "./ProfileCard.css";

export default function ProfileCard({ name, image, bio }) {
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
    </div>
  );
}