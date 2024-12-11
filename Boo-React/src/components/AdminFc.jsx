import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../Styles/Admin.css';
import { AddOutlined, Delete, Settings } from '@mui/icons-material';
import Navbar from './Navbar';

const currentDate = new Date();
const formattedDate = format(currentDate, 'dd/MM/yyyy');

const AdminFc = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Retrieve users from sessionStorage
    const existingUsers = JSON.parse(sessionStorage.getItem('users')) || [];
    setUsers(existingUsers);
  }, []);

  // Function to handle user deletion
  const handleDeleteUser = (index) => {
    // Create a copy of the users array
    const updatedUsers = [...users];
    // Remove the user at the specified index
    updatedUsers.splice(index, 1);
    // Update the state with the updated users array
    setUsers(updatedUsers);
    // Update the session storage with the updated users array
    sessionStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Function to handle form submission for adding a new user
  const handleAddUser = (event) => {
    event.preventDefault();
  
    // Check if a user with the same email already exists
    const userExists = users.some(user => user.email === newUserEmail);
  
    if (userExists) {
      // Alert message if user already exists
      alert("User already exists with this email.");
      return; // Stop further execution
    }
  
    // If user does not exist, proceed to add the new user
    const newUser = { email: newUserEmail, password: newUserPassword };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    sessionStorage.setItem('users', JSON.stringify(updatedUsers));
    // Clear input fields after adding user
    setNewUserEmail('');
    setNewUserPassword('');
    // Hide the add user form
    setShowAddUserForm(false);
  };
  // Function to handle password change form submission
  const handleChangePassword = (event) => {
    event.preventDefault();
    // Create a copy of the users array
    const updatedUsers = [...users];
    // Update the password of the selected user
    updatedUsers[selectedUserIndex].password = newPassword;
    // Update the state with the updated users array
    setUsers(updatedUsers);
    // Update the session storage with the updated users array
    sessionStorage.setItem('users', JSON.stringify(updatedUsers));
    // Reset state values
    setShowPasswordChangeForm(false);
    setSelectedUserIndex(null);
    setNewPassword('');
  };

  return (
    <div><Navbar/>
    <div className="container-xl">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-5">
                <h2>User <b>Management</b></h2>
              </div>
              <div className="col-sm-7">
                <button className="btn btn-secondary" onClick={() => setShowAddUserForm(true)}><i className="material-icons"><AddOutlined/></i> <span>Add New User</span></button>
              </div>
            </div>
          </div>
          {showAddUserForm && (
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <input type="email" className="form-control" placeholder="Enter email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Enter password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">OK</button>
            </form>
          )}
          {showPasswordChangeForm && (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <input type="password" className="form-control" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
          )}
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Password</th>
                <th>Date Created</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{formattedDate}</td>
                  <td>User</td>
                  <td><span className="status text-success">&bull;</span> Active</td>
                  <td>
                    <a href="#" className="settings" title="Settings" data-toggle="tooltip" onClick={() => { setShowPasswordChangeForm(true); setSelectedUserIndex(index); }}><i className="material-icons"><Settings/></i></a>
                    <a href="#" className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteUser(index)}><i className="material-icons"><Delete/></i></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">Showing <b>{users.length}</b> out of <b>25</b> entries</div>
            <ul className="pagination">
              <li className="page-item disabled"><a href="#">Previous</a></li>
              <li className="page-item"><a href="#" className="page-link">1</a></li>
              <li className="page-item"><a href="#" className="page-link">2</a></li>
              {/* Other pagination items go here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AdminFc;