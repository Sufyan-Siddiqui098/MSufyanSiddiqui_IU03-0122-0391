import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
import { validatePassword, getPasswordStrength } from '../../utils/validation';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null });
  
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEditModal = (user) => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'CUSTOMER'
    });
    setEditModal({ open: true, user });
  };

  const openPasswordModal = (user) => {
    setPasswordForm({ newPassword: '', confirmNewPassword: '' });
    setPasswordErrors([]);
    setPasswordModal({ open: true, user });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editModal.user) return;
    
    setSaving(true);
    try {
      const response = await adminAPI.updateUser(editModal.user._id, editForm);
      if (response.data.success) {
        setUsers(users.map(u => u._id === editModal.user._id ? response.data.user : u));
        toast.success('User updated successfully');
        setEditModal({ open: false, user: null });
      }
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordModal.user) return;
    
    const validation = validatePassword(passwordForm.newPassword);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      toast.error('Please fix password requirements');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setSaving(true);
    try {
      const response = await adminAPI.updateUserPassword(passwordModal.user._id, passwordForm);
      if (response.data.success) {
        toast.success('Password updated successfully');
        setPasswordModal({ open: false, user: null });
      }
    } catch (err) {
      console.error('Error updating password:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      await adminAPI.deleteUser(deleteModal.user._id);
      setUsers(users.filter(u => u._id !== deleteModal.user._id));
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <span className="text-sm text-gray-500">{users.length} total</span>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden lg:table-cell">Role</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 hidden md:table-cell">{user.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize hidden lg:table-cell">{user.role?.toLowerCase()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end flex-wrap">
                        <button onClick={() => openEditModal(user)} className="text-sm text-gray-600 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => openPasswordModal(user)} className="text-sm text-gray-600 hover:underline">
                          Password
                        </button>
                        {user.role?.toUpperCase() !== 'ADMIN' && (
                          <button onClick={() => setDeleteModal({ open: true, user })} className="text-sm text-red-600 hover:underline">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, user: null })} title="Edit User">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required />
            <Input label="Last Name" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} required />
          </div>
          <Input label="Email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
          <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setEditModal({ open: false, user: null })}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={passwordModal.open} onClose={() => setPasswordModal({ open: false, user: null })} title={`Change Password - ${passwordModal.user?.firstName}`}>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Input label="New Password" type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded">
                    <div className={`h-1 rounded transition-all ${passwordStrength.color}`} style={{ width: `${(5 - passwordErrors.length) * 20}%` }} />
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                </div>
                {passwordErrors.length > 0 && (
                  <ul className="text-xs text-red-600 space-y-1">
                    {passwordErrors.map((error, i) => (<li key={i}>- {error}</li>))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <Input label="Confirm New Password" type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} required />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setPasswordModal({ open: false, user: null })}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, user: null })} title="Delete User">
        <p className="text-gray-600 mb-6">Are you sure you want to delete "{deleteModal.user?.firstName} {deleteModal.user?.lastName}"?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, user: null })}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
