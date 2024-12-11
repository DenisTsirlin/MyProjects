import React, { useState } from 'react';
import RegisterFc from '../components/RegisterFc';

export default function Register() {
  const [users, setUsers] = useState([]);

  const handleRegister = (newUser) => {
    setUsers([...users, newUser]);
  };

  return (
    <div>
      <RegisterFc onRegister={handleRegister} />
    </div>
  );
}
