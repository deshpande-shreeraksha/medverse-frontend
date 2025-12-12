import React from 'react';
import AdminUserList from '../components/AdminUserList';

const AdminUsers = () => {
  return (
    <div className="container my-4">
      <h2 className="h4 mb-3">Manage Users</h2>
      <AdminUserList />
    </div>
  );
};

export default AdminUsers;
