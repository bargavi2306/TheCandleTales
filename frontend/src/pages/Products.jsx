import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtil';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts 
} from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useToast } from '../context/ToastContext';
import { BUSINESS_CONFIG } from '../config/businessConfig';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Package, 
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Leaf,
  Star,
  Heart,
  Upload,
  ImagePlus,
  Flame,
  Tag,
  Flower,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Award,
  MoreHorizontal
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, in, out
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterBestSeller, setFilterBestSeller] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Form Fields State
  const [prodName, setProdName] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFragrance, setProdFragrance] = useState('');
  const [prodBurnTime, setProdBurnTime] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);
  const [isStockOut, setIsStockOut] = useState(false);
  
  // Image List State (for multi-image selector)
  const [imageUrls, setImageUrls] = useState([]);
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const initData = async () => {
      try {
        const catRes = await getCategories();
        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    initData();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Fetch products when search criteria change
  useEffect(() => {
    loadProducts();
    setCurrentPage(1);
  }, [searchQuery, filterStock, filterFeatured, filterBestSeller]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Fetch all products
      const data = await getProducts();
      let filtered = data.data || [];

      // Apply unified search client-side (name, category, fragrance)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          (p.category?.name && p.category.name.toLowerCase().includes(query)) ||
          (p.fragrance && p.fragrance.toLowerCase().includes(query))
        );
      }

      // Apply extra client-side filters
      if (filterStock === 'in') {
        filtered = filtered.filter(p => p.stock > 0);
      } else if (filterStock === 'out') {
        filtered = filtered.filter(p => p.stock === 0);
      }
      if (filterFeatured) {
        filtered = filtered.filter(p => p.featured);
      }
      if (filterBestSeller) {
        filtered = filtered.filter(p => p.bestSeller);
      }

      setProducts(filtered);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch product catalog.", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!prodName.trim()) errors.name = "Product name is required";
    if (!prodCategoryId) errors.categoryId = "Category is required";
    if (!prodPrice || parseFloat(prodPrice) <= 0) errors.price = "Price must be greater than 0.00";
    if (!prodDescription.trim()) errors.description = "Description is required";
    if (!prodStock || parseInt(prodStock) < 0) errors.stock = "Stock cannot be negative";
    if (imageUrls.length === 0) errors.images = "At least one product image is required";
    
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      addToast("Please fill in all required fields (Name, Category, Price, Stock) at the top of the form.", "error");
    }
    return isValid;
  };

  const handleOpenAdd = () => {
    setProdName('');
    setProdCategoryId(categories[0]?.id || '');
    setProdPrice('');
    setProdDescription('');
    setProdFragrance('');
    setProdBurnTime('');
    setProdStock('');
    setProdFeatured(false);
    setProdBestSeller(false);
    setIsStockOut(false);
    setImageUrls([]);
    setInputImageUrl('');
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleOpenEdit = (product) => {
    setActiveProduct(product);
    setProdName(product.name);
    setProdCategoryId(product.category?.id || '');
    setProdPrice(product.price.toString());
    setProdDescription(product.description || '');
    setProdFragrance(product.fragrance || '');
    setProdBurnTime(product.burnTime || '');
    setProdStock(product.stock.toString());
    setProdFeatured(product.featured || false);
    setProdBestSeller(product.bestSeller || false);
    setIsStockOut(product.stock === 0);
    setImageUrls(product.images ? product.images.map(img => ({ file: null, url: img.imageUrl, preview: img.imageUrl })) : []);
    setInputImageUrl('');
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (product) => {
    setActiveProduct(product);
    setIsDeleteOpen(true);
  };

  // Image Selector Helpers
  const handleAddImageUrl = () => {
    if (!inputImageUrl.trim()) return;
    if (!inputImageUrl.startsWith('http://') && !inputImageUrl.startsWith('https://') && !inputImageUrl.startsWith('/uploads')) {
      addToast("Please enter a valid URL beginning with http:// or https://", "error");
      return;
    }
    setImageUrls(prev => [...prev, { file: null, url: inputImageUrl.trim(), preview: inputImageUrl.trim() }]);
    setInputImageUrl('');
    setFormErrors(prev => ({ ...prev, images: null }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file: file,
      url: null,
      preview: URL.createObjectURL(file)
    }));
    setImageUrls(prev => [...prev, ...newImages]);
    setFormErrors(prev => ({ ...prev, images: null }));
  };

  const handleRemoveImageUrl = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index, direction) => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === imageUrls.length - 1) return;
    
    const nextIndex = direction === 'left' ? index - 1 : index + 1;
    const newUrls = [...imageUrls];
    const temp = newUrls[index];
    newUrls[index] = newUrls[nextIndex];
    newUrls[nextIndex] = temp;
    setImageUrls(newUrls);
  };

  // 1. Create Product Action (Optimistic UI state update)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalLoading(true);

    const remoteUrls = imageUrls.filter(img => img.url).map(img => img.url);
    const filesToUpload = imageUrls.filter(img => img.file).map(img => img.file);

    const productRequest = {
      categoryId: parseInt(prodCategoryId),
      name: prodName,
      price: parseFloat(prodPrice),
      description: prodDescription,
      fragrance: prodFragrance || null,
      burnTime: prodBurnTime || null,
      stock: parseInt(prodStock),
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      imageUrls: remoteUrls
    };

    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(productRequest)], { type: "application/json" }));
    
    filesToUpload.forEach(file => {
      formData.append("files", file);
    });

    try {
      const response = await createProduct(formData);
      const newProduct = response.data;
      
      // Instantly update UI without forcing full page reload
      setProducts(prev => [newProduct, ...prev]);
      addToast("Product created successfully.", "success");
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create product.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 2. Edit Product Action (Optimistic UI state update)
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalLoading(true);

    const remoteUrls = imageUrls.filter(img => img.url).map(img => img.url);
    const filesToUpload = imageUrls.filter(img => img.file).map(img => img.file);

    const productRequest = {
      categoryId: parseInt(prodCategoryId),
      name: prodName,
      price: parseFloat(prodPrice),
      description: prodDescription,
      fragrance: prodFragrance || null,
      burnTime: prodBurnTime || null,
      stock: parseInt(prodStock),
      featured: prodFeatured,
      bestSeller: prodBestSeller,
      imageUrls: remoteUrls
    };

    const formData = new FormData();
    formData.append("product", new Blob([JSON.stringify(productRequest)], { type: "application/json" }));
    
    filesToUpload.forEach(file => {
      formData.append("files", file);
    });

    try {
      const response = await updateProduct(activeProduct.id, formData);
      const updatedProduct = response.data;
      
      // Instantly update UI without forcing full page reload
      setProducts(prev => prev.map(p => p.id === activeProduct.id ? updatedProduct : p));
      addToast("Product updated successfully.", "success");
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update product.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 3. Delete Product Action (Optimistic UI state update)
  const handleDelete = async () => {
    setModalLoading(true);
    const targetId = activeProduct.id;
    
    try {
      await deleteProduct(targetId);
      
      // Instantly update UI without forcing full page reload
      setProducts(prev => prev.filter(p => p.id !== targetId));
      addToast("Product deleted successfully.", "success");
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete product.";
      addToast(msg, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#3D2E1F] font-bold flex items-center gap-1.5">
            Product Catalog <span className="text-[#C4A882] font-semibold text-lg">♡</span>
          </h1>
          <p className="text-[#8B7B6B] text-xs sm:text-sm mt-1">Manage and filter your premium candle products here.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#8B6B4A] hover:bg-[#6E4E37] text-white px-5 py-2.5 rounded-full shadow-md shadow-[#8B6B4A]/15 transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Product <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search & Filter Panel */}
      <div className="bg-[#FAF6F0]/30 border border-[#E5D9C8]/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Combined Unified Search Option */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-[#8B7B6B]/60" />
          <input
            type="text"
            placeholder="Search products by name, category, or fragrance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5D9C8] rounded-xl text-xs bg-white text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all"
          />
        </div>

        {/* Right Side: Stock Status & Toggle Cards */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A4A3A]">
          {/* Stock Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#8B7B6B] font-semibold">Stock:</span>
            <div className="relative">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="border border-[#E5D9C8] rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-[#5A4A3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] appearance-none cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="in">In Stock Only</option>
                <option value="out">Out of Stock Only</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B89B78] pointer-events-none" />
            </div>
          </div>

          {/* Toggle Attributes */}
          <div className="flex items-center gap-2.5">
            <label className={`flex items-center justify-center gap-1.5 py-1.5 px-3.5 border rounded-lg cursor-pointer text-xs font-semibold transition-all ${
              filterFeatured 
                ? 'bg-white border-[#8B6B4A] text-[#3D2E1F] shadow-2xs font-bold' 
                : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-white'
            }`}>
              <input type="checkbox" checked={filterFeatured} onChange={(e) => setFilterFeatured(e.target.checked)} className="sr-only" />
              <Star className={`h-3.5 w-3.5 ${filterFeatured ? 'text-[#8B6B4A] fill-[#8B6B4A]' : 'text-[#B89B78]'}`} />
              Featured
            </label>

            <label className={`flex items-center justify-center gap-1.5 py-1.5 px-3.5 border rounded-lg cursor-pointer text-xs font-semibold transition-all ${
              filterBestSeller 
                ? 'bg-white border-[#8B6B4A] text-[#3D2E1F] shadow-2xs font-bold' 
                : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-white'
            }`}>
              <input type="checkbox" checked={filterBestSeller} onChange={(e) => setFilterBestSeller(e.target.checked)} className="sr-only" />
              <Award className={`h-3.5 w-3.5 ${filterBestSeller ? 'text-[#8B6B4A] fill-[#8B6B4A]' : 'text-[#B89B78]'}`} />
              Best Sellers
            </label>
          </div>
        </div>
      </div>

      {/* Catalog Table */}
      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
          <div className="h-10 bg-gray-150 rounded"></div>
          {[1, 2, 3].map(n => (
            <div key={n} className="h-14 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-500 shadow-sm">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No products match your criteria</h3>
          <p className="text-sm text-gray-500 mt-1">Try resetting your search query or catalog filter settings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-[#E5D9C8]/40 rounded-[28px] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5D9C8]/40">
                <thead className="bg-[#FAF6F0]/40 border-b border-[#D8C8B5]/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Preview</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Fragrance / Burn Time</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider">Attributes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E5D9C8]/25 text-xs text-[#5A4A3A]">
                  {currentItems.map((product) => {
                    const firstImg = getImageUrl(product.images?.[0]?.imageUrl, 'https://via.placeholder.com/150');
                    return (
                      <tr key={product.id} className="hover:bg-[#FAF6F0]/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img 
                            src={firstImg} 
                            alt={product.name} 
                            className="h-11 w-11 object-cover rounded-xl border border-[#D8C8B5]/30 shadow-inner"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#3D2E1F]">
                          {product.name} <span className="text-[#C4A882]/75 font-medium ml-1">♡</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#8B7B6B] font-medium">{product.category?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#3D2E1F]">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                            product.stock === 0 
                              ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                              : 'bg-[#EDFAF0] text-[#4CA670] border border-[#DAF2E3]'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock ⚠️' : `${product.stock} Units`}
                            {product.stock > 0 && <Leaf className="h-3 w-3 text-[#4CA670] fill-current opacity-70" />}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-[#5A4A3A]">
                          <div className="font-semibold text-[#3D2E1F]">{product.fragrance || 'Unscented'}</div>
                          <div className="text-[11px] text-[#8B7B6B] mt-0.5">{product.burnTime || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-2">
                              {product.featured && (
                                <span className="px-2 py-1 rounded-lg bg-[#FAF0DF]/60 text-[#A07D5A] border border-[#EBE0CD]/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  Featured <Star className="h-2.5 w-2.5 fill-current" />
                                </span>
                              )}
                              {product.bestSeller && (
                                <span className="px-2 py-1 rounded-lg bg-[#E5E0FA]/60 text-[#5B4F96] border border-[#D5CFF2]/40 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  Best Seller <Star className="h-2.5 w-2.5 fill-current" />
                                </span>
                              )}
                              {!product.featured && !product.bestSeller && (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </div>

                            {/* Actions Dropdown popover */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === product.id ? null : product.id);
                                }}
                                className="text-[#8B7B6B] hover:text-[#3D2E1F] p-1 rounded-full hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                              >
                                <MoreHorizontal className="h-4.5 w-4.5" />
                              </button>

                              {openMenuId === product.id && (
                                <div className="absolute right-0 mt-1.5 w-24 bg-white border border-[#E5D9C8]/60 rounded-xl shadow-lg z-30 py-1 animate-fadeIn">
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleOpenEdit(product);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-[#5A4A3A] hover:bg-[#FAF6F0] hover:text-[#3D2E1F] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Edit className="h-3.5 w-3.5" /> Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      handleOpenDelete(product);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3.5">
            {currentItems.map((product) => {
              const firstImg = getImageUrl(product.images?.[0]?.imageUrl, 'https://via.placeholder.com/150');
              return (
                <div key={product.id} className="bg-white border border-[#E5D9C8]/40 rounded-2xl p-4 shadow-2xs space-y-3 relative">
                  {/* Top Row: Preview, Name, Category and More Options */}
                  <div className="flex gap-3">
                    <img 
                      src={firstImg} 
                      alt={product.name} 
                      className="h-14 w-14 object-cover rounded-xl border border-[#D8C8B5]/30 shadow-inner flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#3D2E1F] truncate pr-4">
                          {product.name} <span className="text-[#C4A882]/75 font-medium ml-0.5">♡</span>
                        </h4>
                        
                        {/* Action Menu popover */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === product.id ? null : product.id);
                            }}
                            className="text-[#8B7B6B] hover:text-[#3D2E1F] p-1 rounded-full hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                          >
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </button>

                          {openMenuId === product.id && (
                            <div className="absolute right-0 mt-1 w-24 bg-white border border-[#E5D9C8]/60 rounded-xl shadow-lg z-30 py-1 animate-fadeIn">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleOpenEdit(product);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-[#5A4A3A] hover:bg-[#FAF6F0] hover:text-[#3D2E1F] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleOpenDelete(product);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-[#8B7B6B] font-semibold uppercase tracking-wider mt-0.5">{product.category?.name}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-[#3D2E1F]">{BUSINESS_CONFIG.currencySymbol}{product.price.toFixed(2)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${
                          product.stock === 0 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-[#EDFAF0] text-[#4CA670] border border-[#DAF2E3]'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock ⚠️' : `${product.stock} Units`}
                          {product.stock > 0 && <Leaf className="h-2.5 w-2.5 text-[#4CA670] fill-current opacity-70" />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#E5D9C8]/20 pt-2 flex items-center justify-between text-[10px] text-[#8B7B6B]">
                    {/* Fragrance details */}
                    <div>
                      <span className="font-bold text-[#5A4A3A]">{product.fragrance || 'Unscented'}</span>
                      {product.burnTime && <span className="text-[#8B7B6B]/70 ml-1.5">• {product.burnTime}</span>}
                    </div>

                    {/* Attributes */}
                    <div className="flex gap-1">
                      {product.featured && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FAF0DF]/60 text-[#A07D5A] border border-[#EBE0CD]/40 text-[8px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                      {product.bestSeller && (
                        <span className="px-1.5 py-0.5 rounded bg-[#E5E0FA]/60 text-[#5B4F96] border border-[#D5CFF2]/40 text-[8px] font-bold uppercase tracking-wider">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-6 py-4 border border-gray-100 rounded-2xl shadow-sm">
              <span className="text-sm text-gray-500 font-medium">
                Showing <strong className="text-gray-800">{indexOfFirstItem + 1}</strong> to{' '}
                <strong className="text-gray-800">{Math.min(indexOfLastItem, products.length)}</strong> of{' '}
                <strong className="text-gray-800">{products.length}</strong> items
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => paginate(n)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        currentPage === n
                          ? 'bg-primary text-white shadow-md shadow-primary/10'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
<ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal - Add Product */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#3D2E1F]/50 backdrop-blur-md overflow-y-auto">
          {/* Main Card Container */}
          <div className="bg-[#FAF6F0] sm:rounded-[32px] w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] shadow-2xl border border-white/80 overflow-hidden transform transition-all grid grid-cols-1 lg:grid-cols-12 relative">
            
            {/* Left Column — Form Fields (Spans 8 cols) */}
            <form onSubmit={handleCreate} className="lg:col-span-8 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-hidden flex flex-col justify-between">
              
              {/* Header: Sits at the top */}
              <div className="flex items-center justify-between pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#E8D5C0]/40 border border-[#CBB59B]/20 flex items-center justify-center text-[#6E4E37] shadow-inner">
                    <Flame className="h-5 w-5 text-[#8B6B4A]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif text-[#3D2E1F] font-bold">Add New Product</h3>
                    <p className="text-[10px] sm:text-xs text-[#8B7B6B] flex items-center gap-1">
                      Create something beautiful <Heart className="h-2.5 w-2.5 text-rose-400 fill-rose-100" />
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#E8D5C0]/30 flex items-center justify-center text-[#5A4A3A] hover:bg-[#E8D5C0]/50 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                {/* Mobile Image Preview / Selection Area (Only visible on mobile) */}
                <div className="block lg:hidden relative rounded-2xl overflow-hidden border border-[#E5D9C8]/40 shadow-xs bg-white h-40 flex-shrink-0">
                  <img
                    src={imageUrls.length > 0 ? imageUrls[0].preview : "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Form Input Fields Grid */}
                <div className="space-y-4">
                  {/* Row 1: Product Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Product Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.name ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="e.g. Vanilla Bean Candle"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Flame className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.name && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.name}</p>}
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Category *
                      </label>
                      <div className="relative">
                        <select
                          value={prodCategoryId}
                          onChange={(e) => setProdCategoryId(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all appearance-none cursor-pointer ${
                            formErrors.categoryId ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78] pointer-events-none">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.categoryId && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.categoryId}</p>}
                    </div>
                  </div>

                  {/* Row 2: Price and Stock Units */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Price ( ₹ ) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.price ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="19.99"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Tag className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.price && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.price}</p>}
                    </div>

                    {/* Stock Units */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Stock Units *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={prodStock}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProdStock(val);
                            if (parseInt(val, 10) > 0) {
                              setIsStockOut(false);
                            } else if (parseInt(val, 10) === 0) {
                              setIsStockOut(true);
                            }
                          }}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.stock ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="50"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Package className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.stock && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.stock}</p>}
                    </div>
                  </div>

                  {/* Row 3: Fragrance and Burn Time */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Fragrance */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Fragrance
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodFragrance}
                          onChange={(e) => setProdFragrance(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-[#E5D9C8] rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all"
                          placeholder="e.g. Sweet Vanilla"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Flower className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Burn Time */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Burn Time
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodBurnTime}
                          onChange={(e) => setProdBurnTime(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-[#E5D9C8] rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all"
                          placeholder="e.g. 40-50 Hours"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Description */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                      <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Description *
                    </label>
                    <div className="relative">
                      <textarea
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        rows="2.5"
                        className={`w-full px-4 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                          formErrors.description ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                        }`}
                        placeholder="Provide details about the wax, fragrance layers, and overall quality..."
                      />
                      <div className="absolute right-3.5 bottom-3.5 text-[#B89B78]/50">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                    {formErrors.description && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.description}</p>}
                  </div>

                  {/* Row 5: Premium Featured / Best Seller / Out of Stock Toggles */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Featured */}
                    <button
                      type="button"
                      onClick={() => setProdFeatured(!prodFeatured)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        prodFeatured
                          ? 'bg-white border-[#8B6B4A] text-[#3D2E1F]'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${prodFeatured ? 'text-[#8B6B4A] fill-[#8B6B4A]' : 'text-[#B89B78]'}`} />
                      Featured
                    </button>

                    {/* Best Seller */}
                    <button
                      type="button"
                      onClick={() => setProdBestSeller(!prodBestSeller)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        prodBestSeller
                          ? 'bg-white border-[#8B6B4A] text-[#3D2E1F]'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${prodBestSeller ? 'text-rose-500 fill-rose-500' : 'text-[#B89B78]'}`} />
                      Best Seller
                    </button>

                    {/* Out of Stock Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isStockOut) {
                          setIsStockOut(false);
                          setProdStock('10');
                        } else {
                          setIsStockOut(true);
                          setProdStock('0');
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        isStockOut
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <AlertTriangle className={`h-3.5 w-3.5 ${isStockOut ? 'text-rose-500 fill-rose-100' : 'text-[#B89B78]'}`} />
                      Sold Out
                    </button>
                  </div>

                  {/* Tiny Dotted Divider with Heart */}
                  <div className="relative flex items-center justify-center py-1">
                    <div className="w-full border-t border-dashed border-[#D8C8B5]/40"></div>
                    <Heart className="absolute h-3 w-3 text-[#C4A882]/70 bg-[#FAF6F0] px-1.5" fill="currentColor" />
                  </div>

                  {/* Row 6: Product Images (Upload Box) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A]">
                      <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Product Images *
                    </label>
                    
                    <div className="border border-dashed border-[#CBB59B] rounded-2xl p-3.5 bg-[#FAF6F0]/30 space-y-2 text-center">
                      {/* Upload visual card */}
                      <label className="flex flex-col items-center justify-center py-3 px-4 border border-[#E5D9C8]/40 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
                        <ImagePlus className="h-7 w-7 text-[#B89B78] mb-1" />
                        <span className="text-xs font-bold text-[#3D2E1F]">Upload Product Images</span>
                        <span className="text-[10px] text-[#8B7B6B] mt-0.5">Tap to browse or drag & drop</span>
                        <span className="text-[9px] text-[#8B7B6B]/75">PNG, JPG up to 5MB each</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Image URL text input fallback */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={inputImageUrl}
                          onChange={(e) => setInputImageUrl(e.target.value)}
                          className="flex-grow pl-3 pr-3 py-1.5 border border-[#E5D9C8] rounded-xl text-xs bg-white text-[#5A4A3A] focus:outline-none focus:border-[#8B6B4A]"
                          placeholder="Or enter image URL..."
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3 py-1.5 bg-[#E2D4C5] text-[#5A4A3A] font-bold rounded-xl text-xs transition-all cursor-pointer hover:bg-[#D8C8B5]"
                        >
                          Add
                        </button>
                      </div>

                      {/* Previews */}
                      {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {imageUrls.map((imgObj, idx) => (
                            <div key={idx} className="relative rounded-lg border border-[#E5D9C8] bg-white overflow-hidden p-1 flex flex-col items-center">
                              <img src={imgObj.preview} className="h-10 w-full object-cover rounded-md" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImageUrl(idx)}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-rose-50 rounded-full text-rose-600 border border-rose-100 hover:bg-rose-100 cursor-pointer z-10"
                              >
                                <X className="h-2 w-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stacked Action Buttons */}
              <div className="pt-4 border-t border-[#D8C8B5]/30 flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full sm:flex-grow py-2.5 bg-[#5C4533] hover:bg-[#3D2E1F] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {modalLoading ? "Saving Product..." : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-full sm:w-28 py-2.5 border border-[#E5D9C8] text-[#5A4A3A] bg-[#FAF8F5]/50 hover:bg-[#FAF6F0] rounded-xl text-xs font-bold transition-all cursor-pointer text-center block"
                >
                  Cancel
                </button>
              </div>

            </form>

            {/* Right Column — Beautiful Candle Image (Spans 4 cols, visible only on desktop) */}
            <div className="hidden lg:block lg:col-span-4 relative h-full">
              <img
                src={imageUrls.length > 0 ? imageUrls[0].preview : "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"}
                alt="Candle Tales artisanal soy candle decor"
                className="w-full h-full object-cover rounded-r-[32px]"
                style={{ minHeight: '100%', maxHeight: '90vh' }}
              />
              <div className="absolute inset-0 bg-[#3D2E1F]/10 rounded-r-[32px]" />
            </div>

          </div>
        </div>
      )}

      {/* Modal - Edit Product */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#3D2E1F]/50 backdrop-blur-md overflow-y-auto">
          {/* Main Card Container */}
          <div className="bg-[#FAF6F0] sm:rounded-[32px] w-full max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] shadow-2xl border border-white/80 overflow-hidden transform transition-all grid grid-cols-1 lg:grid-cols-12 relative">
            
            {/* Left Column — Form Fields (Spans 8 cols) */}
            <form onSubmit={handleEdit} className="lg:col-span-8 p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-hidden flex flex-col justify-between">
              
              {/* Header: Sits at the top */}
              <div className="flex items-center justify-between pb-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#E8D5C0]/40 border border-[#CBB59B]/20 flex items-center justify-center text-[#6E4E37] shadow-inner">
                    <Flame className="h-5 w-5 text-[#8B6B4A]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif text-[#3D2E1F] font-bold">Edit Product</h3>
                    <p className="text-[10px] sm:text-xs text-[#8B7B6B] flex items-center gap-1">
                      Update your beautiful creation <Heart className="h-2.5 w-2.5 text-rose-400 fill-rose-100" />
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#E8D5C0]/30 flex items-center justify-center text-[#5A4A3A] hover:bg-[#E8D5C0]/50 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                {/* Mobile Image Preview / Selection Area (Only visible on mobile) */}
                <div className="block lg:hidden relative rounded-2xl overflow-hidden border border-[#E5D9C8]/40 shadow-xs bg-white h-40 flex-shrink-0">
                  <img
                    src={imageUrls.length > 0 ? imageUrls[0].preview : "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                {/* Form Input Fields Grid */}
                <div className="space-y-4">
                  {/* Row 1: Product Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Product Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.name ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="e.g. Vanilla Bean Candle"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Flame className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.name && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.name}</p>}
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Category *
                      </label>
                      <div className="relative">
                        <select
                          value={prodCategoryId}
                          onChange={(e) => setProdCategoryId(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all appearance-none cursor-pointer ${
                            formErrors.categoryId ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78] pointer-events-none">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.categoryId && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.categoryId}</p>}
                    </div>
                  </div>

                  {/* Row 2: Price and Stock Units */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Price ( ₹ ) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.price ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="19.99"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Tag className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.price && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.price}</p>}
                    </div>

                    {/* Stock Units */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Stock Units *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={prodStock}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProdStock(val);
                            if (parseInt(val, 10) > 0) {
                              setIsStockOut(false);
                            } else if (parseInt(val, 10) === 0) {
                              setIsStockOut(true);
                            }
                          }}
                          className={`w-full pl-4 pr-10 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                            formErrors.stock ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                          }`}
                          placeholder="50"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Package className="h-4 w-4" />
                        </div>
                      </div>
                      {formErrors.stock && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.stock}</p>}
                    </div>
                  </div>

                  {/* Row 3: Fragrance and Burn Time */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Fragrance */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Fragrance
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodFragrance}
                          onChange={(e) => setProdFragrance(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-[#E5D9C8] rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all"
                          placeholder="e.g. Sweet Vanilla"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Flower className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Burn Time */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                        <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Burn Time
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={prodBurnTime}
                          onChange={(e) => setProdBurnTime(e.target.value)}
                          className="w-full pl-4 pr-10 py-2 border border-[#E5D9C8] rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all"
                          placeholder="e.g. 40-50 Hours"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B89B78]">
                          <Clock className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Description */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A] mb-1">
                      <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Description *
                    </label>
                    <div className="relative">
                      <textarea
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        rows="2.5"
                        className={`w-full px-4 py-2 border rounded-xl text-xs bg-[#FAF6F0]/40 text-[#5A4A3A] focus:outline-none focus:ring-2 focus:ring-[#8B6B4A]/10 focus:border-[#8B6B4A] transition-all ${
                          formErrors.description ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-200' : 'border-[#E5D9C8]'
                        }`}
                        placeholder="Provide details about the wax, fragrance layers, and overall quality..."
                      />
                      <div className="absolute right-3.5 bottom-3.5 text-[#B89B78]/50">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </div>
                    {formErrors.description && <p className="mt-1 text-[10px] text-rose-500 font-medium">{formErrors.description}</p>}
                  </div>

                  {/* Row 5: Premium Featured / Best Seller / Out of Stock Toggles */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Featured */}
                    <button
                      type="button"
                      onClick={() => setProdFeatured(!prodFeatured)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        prodFeatured
                          ? 'bg-white border-[#8B6B4A] text-[#3D2E1F]'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${prodFeatured ? 'text-[#8B6B4A] fill-[#8B6B4A]' : 'text-[#B89B78]'}`} />
                      Featured
                    </button>

                    {/* Best Seller */}
                    <button
                      type="button"
                      onClick={() => setProdBestSeller(!prodBestSeller)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        prodBestSeller
                          ? 'bg-white border-[#8B6B4A] text-[#3D2E1F]'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${prodBestSeller ? 'text-rose-500 fill-rose-500' : 'text-[#B89B78]'}`} />
                      Best Seller
                    </button>

                    {/* Out of Stock Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isStockOut) {
                          setIsStockOut(false);
                          setProdStock('10');
                        } else {
                          setIsStockOut(true);
                          setProdStock('0');
                        }
                      }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 border rounded-xl text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                        isStockOut
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-white/45 border-[#E5D9C8] text-[#8B7B6B] hover:bg-[#FAF6F0]/50'
                      }`}
                    >
                      <AlertTriangle className={`h-3.5 w-3.5 ${isStockOut ? 'text-rose-500 fill-rose-100' : 'text-[#B89B78]'}`} />
                      Sold Out
                    </button>
                  </div>

                  {/* Tiny Dotted Divider with Heart */}
                  <div className="relative flex items-center justify-center py-1">
                    <div className="w-full border-t border-dashed border-[#D8C8B5]/40"></div>
                    <Heart className="absolute h-3 w-3 text-[#C4A882]/70 bg-[#FAF6F0] px-1.5" fill="currentColor" />
                  </div>

                  {/* Row 6: Product Images (Upload Box) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#5A4A3A]">
                      <Leaf className="h-3 w-3 text-[#B89B78] transform -rotate-45" /> Product Images *
                    </label>
                    
                    <div className="border border-dashed border-[#CBB59B] rounded-2xl p-3.5 bg-[#FAF6F0]/30 space-y-2 text-center">
                      {/* Upload visual card */}
                      <label className="flex flex-col items-center justify-center py-3 px-4 border border-[#E5D9C8]/40 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
                        <ImagePlus className="h-7 w-7 text-[#B89B78] mb-1" />
                        <span className="text-xs font-bold text-[#3D2E1F]">Upload Product Images</span>
                        <span className="text-[10px] text-[#8B7B6B] mt-0.5">Tap to browse or drag & drop</span>
                        <span className="text-[9px] text-[#8B7B6B]/75">PNG, JPG up to 5MB each</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Image URL text input fallback */}
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={inputImageUrl}
                          onChange={(e) => setInputImageUrl(e.target.value)}
                          className="flex-grow pl-3 pr-3 py-1.5 border border-[#E5D9C8] rounded-xl text-xs bg-white text-[#5A4A3A] focus:outline-none focus:border-[#8B6B4A]"
                          placeholder="Or enter image URL..."
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3 py-1.5 bg-[#E2D4C5] text-[#5A4A3A] font-bold rounded-xl text-xs transition-all cursor-pointer hover:bg-[#D8C8B5]"
                        >
                          Add
                        </button>
                      </div>

                      {/* Previews */}
                      {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {imageUrls.map((imgObj, idx) => (
                            <div key={idx} className="relative rounded-lg border border-[#E5D9C8] bg-white overflow-hidden p-1 flex flex-col items-center">
                              <img src={imgObj.preview} className="h-10 w-full object-cover rounded-md" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImageUrl(idx)}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-rose-50 rounded-full text-rose-600 border border-rose-100 hover:bg-rose-100 cursor-pointer z-10"
                              >
                                <X className="h-2 w-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stacked Action Buttons */}
              <div className="pt-4 border-t border-[#D8C8B5]/30 flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full sm:flex-grow py-2.5 bg-[#5C4533] hover:bg-[#3D2E1F] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {modalLoading ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-full sm:w-28 py-2.5 border border-[#E5D9C8] text-[#5A4A3A] bg-[#FAF8F5]/50 hover:bg-[#FAF6F0] rounded-xl text-xs font-bold transition-all cursor-pointer text-center block"
                >
                  Cancel
                </button>
              </div>

            </form>

            {/* Right Column — Beautiful Candle Image (Spans 4 cols, visible only on desktop) */}
            <div className="hidden lg:block lg:col-span-4 relative h-full">
              <img
                src={imageUrls.length > 0 ? imageUrls[0].preview : "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"}
                alt="Candle Tales artisanal soy candle decor"
                className="w-full h-full object-cover rounded-r-[32px]"
                style={{ minHeight: '100%', maxHeight: '90vh' }}
              />
              <div className="absolute inset-0 bg-[#3D2E1F]/10 rounded-r-[32px]" />
            </div>

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
                Are you sure you want to delete product <strong className="text-gray-800">"{activeProduct?.name}"</strong>? This will also delete all associated product images.
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

export default Products;
