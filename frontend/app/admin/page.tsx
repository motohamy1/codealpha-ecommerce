"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Loader2,
  FileImage,
  Package,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { fetchProducts, createProduct, updateProduct, deleteProduct, loginUser } from "../../lib/api";
import type { Product } from "../../lib/types";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [adminName, setAdminName] = useState("");

  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  
  const [imageType, setImageType] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const payload = JSON.parse(atob(parts[1]));
      
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new Error("Token expired");
      }
      
      if (payload.role !== "admin") {
        throw new Error("Not an admin");
      }
      
      setAdminName(`${payload.firstName} ${payload.lastName}`);
      setIsAuthenticated(true);
      loadProducts();
    } catch (err) {
      localStorage.removeItem("admin_token");
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setProducts([]);
    setAdminName("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const response = await loginUser(loginEmail, loginPassword);
      const token = response.token;
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Received an invalid token from the server.");
      }
      const payload = JSON.parse(atob(parts[1]));
      if (payload.role !== "admin") {
        throw new Error("Access denied. Only administrators are allowed to access this panel.");
      }
      
      localStorage.setItem("admin_token", token);
      setAdminName(`${payload.firstName} ${payload.lastName}`);
      setIsAuthenticated(true);
      
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
      setLoading(false);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        if (err.message.toLowerCase().includes("denied") || err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("unauthorized")) {
          handleLogout();
        }
      })
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageUrl("");
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setCategory(product.category || "");
    setPrice(product.price.toString());
    setStock(product.stock !== undefined ? product.stock.toString() : "0");
    setDescription(product.description || "");
    
    if (product.image.startsWith("http") && !product.image.includes("localhost:5000/uploads/")) {
      setImageType("url");
      setImageUrl(product.image);
    } else {
      setImageType("url");
      setImageUrl(product.image);
    }
    setPreviewUrl(product.image);
    setImageFile(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setTitle("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");
    setImageType("file");
    setImageUrl("");
    setImageFile(null);
    setPreviewUrl("");
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      if (editingProduct?.id === id) {
        resetForm();
      }
      alert("Product deleted successfully");
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
      if (err.message.toLowerCase().includes("denied") || err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("unauthorized")) {
        handleLogout();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (!title.trim()) throw new Error("Title is required.");
      if (!category.trim()) throw new Error("Category is required.");
      if (isNaN(Number(price)) || Number(price) <= 0) throw new Error("Price must be a positive number.");
      if (isNaN(Number(stock)) || Number(stock) < 0) throw new Error("Stock cannot be negative.");

      let data: FormData | Partial<Product>;
      
      if (imageType === "file" && imageFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("description", description);
        formData.append("imageFile", imageFile);
        data = formData;
      } else {
        const finalImage = imageType === "url" ? imageUrl : "";
        if (!finalImage && !editingProduct) {
          throw new Error("Product image is required (either upload a file or paste a URL).");
        }
        data = {
          title,
          category,
          price: Number(price),
          stock: Number(stock),
          description,
          image: finalImage,
        };
      }

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id!, data);
        setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
        setFormSuccess("Product updated successfully!");
        resetForm();
      } else {
        const created = await createProduct(data);
        setProducts([created, ...products]);
        setFormSuccess("Product added successfully!");
        resetForm();
      }
    } catch (err: any) {
      setFormError(err.message);
      if (err.message.toLowerCase().includes("denied") || err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("unauthorized")) {
        setTimeout(() => handleLogout(), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-canvas">
        <Loader2 className="h-10 w-10 animate-spin text-stone-400" />
        <p className="mt-3 text-sm text-muted animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-canvas">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-white p-8 shadow-xl shadow-stone-100/50">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-white">
              <Package className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-muted">
              Please sign in to manage catalog and products.
            </p>
          </div>
          
          {loginError && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 p-4 text-sm text-red-800 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <div>
                <p className="font-semibold">Authentication Failed</p>
                <p className="mt-0.5 text-red-700 leading-relaxed">{loginError}</p>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@luxe.com"
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loggingIn}
                className="group relative flex w-full justify-center rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/10 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {loggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center border-t border-border pt-6">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div>
          <a
            href="/"
            className="group mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Shop
          </a>
          <h1 className="text-3xl font-bold text-ink">Catalog Management</h1>
          <p className="mt-1 text-sm text-muted">
            Logged in as <span className="font-semibold text-stone-700">{adminName || "Administrator"}</span>. Create, update, and manage your inventory and product images.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {!loading && (
            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-ink">
              <Package className="h-4.5 w-4.5 text-stone-400" />
              <span>{products.length} Products</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex h-11 items-center justify-center rounded-full border border-red-200 bg-red-50/50 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Product List */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-ink">Product Catalog</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-stone-400" />
              <p className="mt-3 text-sm text-muted">Loading catalog items…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center">
              <AlertCircle className="mb-4 h-10 w-10 text-stone-400" />
              <p className="text-lg font-semibold text-ink">Failed to load catalog</p>
              <p className="mt-1 text-sm text-muted">{error}</p>
              <button
                onClick={loadProducts}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 text-center">
              <Package className="mb-4 h-10 w-10 text-stone-400" />
              <p className="text-lg font-semibold text-ink">No products found</p>
              <p className="mt-1 text-sm text-muted">The product catalog is currently empty.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-stone-50 text-xs font-semibold uppercase tracking-wider text-muted">
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-center">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="group transition-colors hover:bg-stone-50/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-border bg-stone-100">
                              {product.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-stone-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-ink max-w-[200px] truncate">
                                {product.title}
                              </div>
                              <div className="text-xs text-muted max-w-[200px] truncate">
                                {product.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-ink">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-ink">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              product.stock === 0
                                ? "bg-red-50 text-red-700"
                                : product.stock! <= 5
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {product.stock} left
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-ink hover:bg-ink hover:text-white"
                              title="Edit product"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id!)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Manage Product Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-ink">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            {/* Notification messages */}
            {formError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                <div>
                  <p className="font-semibold">Verification Error</p>
                  <p className="mt-0.5 text-red-700 leading-relaxed">{formError}</p>
                </div>
              </div>
            )}

            {formSuccess && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-green-50 p-4 text-sm text-green-800">
                <Check className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="mt-0.5 text-green-700 leading-relaxed">{formSuccess}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ceramic Espresso Cup"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              {/* Row: Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Home"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g., 10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a few lines describing the product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-stone-50 px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-ink resize-none"
                />
              </div>

              {/* Image Input Section */}
              <div className="rounded-xl border border-border bg-stone-50/50 p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Product Image
                </label>

                {/* Tabs */}
                <div className="mt-3 flex rounded-lg border border-border bg-stone-100 p-0.5">
                  <button
                    type="button"
                    onClick={() => setImageType("file")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                      imageType === "file"
                        ? "bg-white text-ink shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageType("url")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${
                      imageType === "url"
                        ? "bg-white text-ink shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    Image URL
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  {imageType === "file" ? (
                    <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white p-5 text-center transition-colors hover:bg-stone-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <FileImage className="h-8 w-8 text-stone-400" />
                      <p className="mt-2 text-xs font-semibold text-ink">
                        {imageFile ? imageFile.name : "Click to upload product image"}
                      </p>
                      <p className="mt-1 text-[10px] text-muted">
                        {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "Supports PNG, JPG, WEBP up to 10MB"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={imageUrl}
                        onChange={handleUrlChange}
                        className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      />
                    </div>
                  )}
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Preview Image
                    </div>
                    <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Product Preview"
                        className="h-full w-full object-cover"
                        onError={() => setFormError("The selected image could not be loaded. Please ensure the URL is correct.")}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImageUrl("");
                          setPreviewUrl("");
                        }}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900/80 text-white backdrop-blur-sm transition-transform hover:scale-105"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-full border border-border bg-white py-3 text-sm font-semibold text-ink transition-all hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-ink/20 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying & Saving…
                    </>
                  ) : editingProduct ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
