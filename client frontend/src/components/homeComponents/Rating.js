import React from "react";

const Star = ({ fill }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id={`star-${fill}`}>
        <stop offset={`${fill}%`} stopColor="#0d5c4a" />
        <stop offset={`${fill}%`} stopColor="#c9cbcf" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#star-${fill})`}
      d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
    />
  </svg>
);

const Rating = ({ value = 0, text }) => (
  <div className="rating-x">
    <span className="stars" role="img" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} fill={value >= n ? 100 : value >= n - 0.5 ? 50 : 0} />
      ))}
    </span>
    {text && <span>{text}</span>}
  </div>
);

export default Rating;
