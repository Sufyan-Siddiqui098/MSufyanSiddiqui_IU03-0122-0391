import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUser } from '../store/slices/authSlice';
import { authAPI } from '../api/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';
import { validatePassword, getPasswordStrength } from '../utils/validation';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    password: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateUser(formData);
      if (response.data.success) {
        dispatch(updateUser(response.data.user));
        toast.success('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    if (name === 'newPassword') {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    const validation = validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      toast.error('Please fix password requirements');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.updatePassword(passwordData);
      if (response.data.success) {
        toast.success('Password updated successfully');
        setPasswordModal(false);
        setPasswordData({ password: '', newPassword: '', confirmNewPassword: '' });
        setPasswordErrors([]);
      }
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-gray-600">
                {user.firstName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>
          
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <p className="text-gray-900">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <p className="text-gray-900">{user.lastName}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-gray-900">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Account Type</label>
                <p className="text-gray-900 capitalize">{user.role?.toLowerCase()}</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
            {!editMode && (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            )}
            <Button variant="outline" onClick={() => setPasswordModal(true)}>
              Change Password
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            name="password"
            value={passwordData.password}
            onChange={handlePasswordChange}
            required
          />
          <div>
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordData.newPassword && (
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
          <Input
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
            required
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => setPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
