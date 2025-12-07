import React, { useEffect, useState } from "react";

const Counter = ({ end, label, icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 50;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="counter-card text-center p-4 shadow rounded">
      <div className="fs-1 mb-2">{icon}</div>
      <h2 className="fw-bold">{count}+</h2>
      <p className="text-muted">{label}</p>
    </div>
  );
};

export default Counter;
