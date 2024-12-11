import React, { useState } from 'react';
import LoginFc from '../components/LoginFc';

export default function Login() {
  const [users] = useState([]);

  const handleLogin = (user) => {
    console.log(user);
  }

  return (
    <LoginFc users={users} onLogin={handleLogin} />
  );
}
