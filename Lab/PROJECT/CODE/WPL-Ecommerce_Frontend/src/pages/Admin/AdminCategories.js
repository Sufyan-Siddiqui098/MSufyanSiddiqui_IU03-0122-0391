import React, { useEffect, useState } from 'react';
import { adminAPI, categoriesAPI } from '../../api/api';
import Loader from '../../components/UI/Loader';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, category: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [formData, setFormData] = useState({ name: '', photo: null });

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openForm = (category = null) => {
    setFormData({ name: category?.name || '' });
    setFormModal({ open: true, category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name)
      if (formData.photo) data.append('photo', formData.photo);
      if (formModal.category) {
        const response = await adminAPI.updateCategory(formModal.category._id, data);
        toast.success(response.data.message || "Updated Successfully");
        // console.log("Update category response ", response)
      } else {
        const response = await adminAPI.createCategory(data);
        // console.log("create category response ", response)
        toast.success(response.data.message || "Created Successfully");
      }
      fetchCategories();
      setFormModal({ open: false, category: null });
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    try {
      const response = await adminAPI.deleteCategory(deleteModal.category._id);
      toast.success(response.data.message || "Deleted.")
      // console.log("delete category response ", response)
      setCategories(categories.filter(c => c._id !== deleteModal.category._id));
      setDeleteModal({ open: false, category: null });
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <Button onClick={() => openForm()}>Add Category</Button>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No categories found</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {categories.map((category) => (
              <div key={category._id} className="flex justify-between items-center py-3 px-4">
                <span className="text-sm text-gray-900">{category.name}</span>
                <div className="flex gap-3">
                  <button onClick={() => openForm(category)} className="text-sm text-gray-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => setDeleteModal({ open: true, category })} className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, category: null })}
        title={formModal.category ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={formData.name}
            name="name"
            onChange={handleChange}
            required
          />

          <div className='my-2 mt-4'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange= {handleChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:text-gray-700 file:rounded-lg"
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" type="button" onClick={() => setFormModal({ open: false, category: null })}>
              Cancel
            </Button>
            <Button type="submit">
              {formModal.category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        title="Delete Category"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{deleteModal.category?.name}"?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, category: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
