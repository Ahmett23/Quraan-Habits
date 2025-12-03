import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page is deprecated as all functionality has been moved to HabitTracker.tsx
const Schedule: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/habits', { replace: true });
  }, [navigate]);

  return null;
};

export default Schedule;