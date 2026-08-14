import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtil';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/categoryService';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Layers,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Active category being edited/deleted
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Form fields
  const [catName, setCatName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch categories list.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!catName.trim()) {
      errors.name = 'Category name is required';
    }
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      addToast("Please fill in the category name.", "error");
    }
    return isValid;
  };

  const handleOpenCreate = () => {
    setCatName('');
    setSelectedFile(null);
    setPreviewUrl('');
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category) => {
    setActiveCategory(category);
    setCatName(category.name);
    setSelectedFile(null);
    setPreviewUrl(category.image || '');
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (category) => {
    setActiveCategory(category);
    setIsDeleteOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    let processedFile = file;
    if (file.size > 5 * 1024 * 1024) {
      addToast("Image exceeds 5MB. Automatically optimizing to reduce size...", "info");
      processedFile = await compressImage(file);
    }
    
    setSelectedFile(processedFile);
    setPreviewUrl(URL.createObjectURL(processedFile));
  };

  // 1. Create Category Action (Optimistic UI state update)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setModalLoading(true);
    const categoryRequest = { name: catName, image: selectedFile ? null : previewUrl };
    
    const formData = new FormData();
    formData.append("category", new Blob([JSON.stringify(categoryRequest)], { type: "application/json" }));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    
    try {
      const response = await createCategory(formData);
      const newCategory = response.data;
      
      // Instantly update UI without forcing full page reload
      setCategories(prev => [...prev, newCategory]);
      addToast("Category created successfully.", "success");
      setIsCreateOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create category.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 2. Edit Category Action (Optimistic UI state update)
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setModalLoading(true);
    const categoryRequest = { name: catName, image: selectedFile ? null : previewUrl };
    
    const formData = new FormData();
    formData.append("category", new Blob([JSON.stringify(categoryRequest)], { type: "application/json" }));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    
    try {
      const response = await updateCategory(activeCategory.id, formData);
      const updatedCategory = response.data;
      
      // Instantly update UI without forcing full page reload
      setCategories(prev => prev.map(c => c.id === activeCategory.id ? updatedCategory : c));
      addToast("Category updated successfully.", "success");
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update category.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 3. Delete Category Action (Optimistic UI state update)
  const handleDelete = async () => {
    setModalLoading(true);
    const targetId = activeCategory.id;
    
    try {
      await deleteCategory(targetId);
      
      // Instantly update UI without forcing full page reload
      setCategories(prev => prev.filter(c => c.id !== targetId));
      addToast("Category deleted successfully.", "success");
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
      // Handles block deletion warning toast if products exist
      const msg = err.response?.data?.message || "Failed to delete category.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Filtering list client-side
  const filteredCategories = categories.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-accent-dark font-semibold">Category Management</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your product classifications here.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-accent-dark text-white px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute inset-y-0 left-3 my-auto h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-primary focus:border-primary rounded-xl text-sm transition-all focus:bg-white"
          />
        </div>
      </div>

      {/* Categories Table */}
      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
          <div className="h-10 bg-gray-150 rounded"></div>
          {[1, 2, 3].map(n => (
            <div key={n} className="h-14 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 shadow-sm">
          <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No categories found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm ? "Try searching with a different term." : "Create your first category catalog structure."}
          </p>
          {!searchTerm && (
            <button 
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold bg-primary hover:bg-accent-dark text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/10"
            >
              <Plus className="h-4 w-4" /> Create Category
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm">
                {filteredCategories.map((category) => {
                  const hasImage = !!category.image;
                  return (
                    <tr key={category.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={getImageUrl(category.image, 'https://via.placeholder.com/150')} 
                          alt={category.name} 
                          className="h-12 w-12 object-cover rounded-lg border border-gray-150 shadow-inner"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="inline-flex items-center p-2 border border-gray-200 text-gray-600 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(category)}
                          className="inline-flex items-center p-2 border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Create Category */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-50 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-serif text-accent-dark font-semibold">Create Category</h3>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-150 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary transition-all ${
                    formErrors.name ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
                  }`}
                  placeholder="e.g. Soy Candles"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category Image</label>
                <div className="mt-2 flex items-center gap-4">
                  {previewUrl ? (
                    <div className="relative h-16 w-16 rounded-xl border border-gray-200 overflow-hidden shadow-inner bg-gray-50 flex-shrink-0">
                      <img src={getImageUrl(previewUrl)} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors shadow-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <Layers className="h-6 w-6" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl shadow-xs text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-gray-500" /> Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2.5 bg-primary text-white hover:bg-accent-dark rounded-xl text-sm font-semibold transition-colors shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {modalLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Edit Category */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-50 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-serif text-accent-dark font-semibold">Edit Category</h3>
              <button 
                onClick={() => setIsEditOpen(false)} 
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-150 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category Name *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className={`mt-1 block w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary transition-all ${
                    formErrors.name ? 'border-rose-300 bg-rose-50' : 'border-gray-200'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category Image</label>
                <div className="mt-2 flex items-center gap-4">
                  {previewUrl ? (
                    <div className="relative h-16 w-16 rounded-xl border border-gray-200 overflow-hidden shadow-inner bg-gray-50 flex-shrink-0">
                      <img src={getImageUrl(previewUrl)} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors shadow-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <Layers className="h-6 w-6" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl shadow-xs text-xs font-semibold text-gray-700 transition-all flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-gray-500" /> Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2.5 bg-primary text-white hover:bg-accent-dark rounded-xl text-sm font-semibold transition-colors shadow-md shadow-primary/10 disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Delete Confirmation */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-50 overflow-hidden transform transition-all p-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete category <strong className="text-gray-800">"{activeCategory?.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={modalLoading}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-rose-150 disabled:opacity-50"
              >
                {modalLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
