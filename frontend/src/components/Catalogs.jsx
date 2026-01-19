import React, { useState, useEffect } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Catalogs({ activeForm }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", image_url: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    category_id: "",
    price: "",
    country: "",
    unit: "",
    description: "",
    image_url: "",
  });

  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);

const [banners, setBanners] = useState([]);
const [editingBannerId, setEditingBannerId] = useState(null);
const [bannerForm, setBannerForm] = useState({ title: "", image_url: "" });
const [bannerImageFile, setBannerImageFile] = useState(null);


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get-categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get-products`)
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
  fetch(`${API_BASE_URL}/api/get-banners`)
    .then(res => res.json())
    .then(setBanners);
}, []);


  // DELETE
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_BASE_URL}/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // EDIT
  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({ name: cat.name, image_url: cat.image_url });
    setCategoryImageFile(null);
  };

  const startEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      country: prod.country,
      unit: prod.unit,
      description: prod.description,
      image_url: prod.image_url,
    });
    setProductImageFile(null);
  };

  // UPDATE
  const handleUpdateCategory = async (id) => {
    let imageUrl = categoryForm.image_url;

    if (categoryImageFile) {
      imageUrl = await uploadToCloudinary(categoryImageFile, "categories");
      if (!imageUrl) return alert("Image upload failed");
    }

    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryForm.name, image_url: imageUrl }),
    });

    const updated = await res.json();

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? updated.category : c))
    );

    setEditingCategoryId(null);
    setCategoryImageFile(null);
  };

  const handleUpdateProduct = async (id) => {
    let imageUrl = productForm.image_url;

    if (productImageFile) {
      imageUrl = await uploadToCloudinary(productImageFile, "products");
      if (!imageUrl) return alert("Image upload failed");
    }

    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...productForm, image_url: imageUrl }),
    });

    const updated = await res.json();

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? updated.product : p))
    );

    setEditingProductId(null);
    setProductImageFile(null);
  };

  const startEditBanner = (banner) => {
  setEditingBannerId(banner.id);
  setBannerForm({ title: banner.title, image_url: banner.image_url });
  setBannerImageFile(null);
};

const handleUpdateBanner = async (id) => {
  let imageUrl = bannerForm.image_url;

  if (bannerImageFile) {
    imageUrl = await uploadToCloudinary(bannerImageFile, "banners");
    if (!imageUrl) return alert("Image upload failed");
  }

  const res = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: bannerForm.title,
      image_url: imageUrl,
    }),
  });

  const updated = await res.json();

  setBanners((prev) =>
    prev.map((b) => (b.id === id ? updated.banner : b))
  );

  setEditingBannerId(null);
};

const handleDeleteBanner = async (id) => {
  if (!window.confirm("Delete this banner?")) return;

  await fetch(`${API_BASE_URL}/api/banners/${id}`, {
    method: "DELETE",
  });

  setBanners((prev) => prev.filter((b) => b.id !== id));
};


  return (
    <div>
{/* category table */}
      {activeForm === "category_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Categories List
          </h2>

          <input
            type="text"
            placeholder="Search..."
            className="mb-4 px-4 py-2 border rounded-lg"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border text-left">ID</th>
                  <th className="px-4 py-3 border text-left">Name</th>
                  <th className="px-4 py-3 border text-center">Image</th>
                  <th className="px-4 py-3 border text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories
                  .filter(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase()) ||
                      c.id.toString().includes(categorySearch)
                  )
                  .map((cat, index) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 border">{index + 1}</td>

                      <td className="px-4 py-3 border">
                        {editingCategoryId === cat.id ? (
                          <input
                            className="border px-2 py-1 rounded w-full"
                            value={categoryForm.name}
                            onChange={(e) =>
                              setCategoryForm({
                                ...categoryForm,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          cat.name
                        )}
                      </td>

                      <td className="px-4 py-3 border text-center">
                        {editingCategoryId === cat.id ? (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setCategoryImageFile(e.target.files[0])
                              }
                            />
                            {(categoryImageFile || categoryForm.image_url) && (
                              <img
                                src={
                                  categoryImageFile
                                    ? URL.createObjectURL(categoryImageFile)
                                    : categoryForm.image_url
                                }
                                className="w-12 h-12 mx-auto mt-2 rounded object-cover"
                              />
                            )}
                          </>
                        ) : (
                          cat.image_url && (
                            <img
                              src={cat.image_url}
                              className="w-12 h-12 mx-auto rounded object-cover"
                            />
                          )
                        )}
                      </td>

                      <td className="px-4 py-3 border text-center">
                        <div className="flex justify-center gap-2">
                          {editingCategoryId === cat.id ? (
                            <button
                              onClick={() => handleUpdateCategory(cat.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )} 
      {/* Product table */}
       {activeForm === "product_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Product List
          </h2>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="mb-4 px-4 py-2 border rounded-lg"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />

            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value === "all"
                    ? "all"
                    : Number(e.target.value)
                )
              }
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">ID</th>
                  <th className="border px-3 py-2">Name</th>
                  <th className="border px-3 py-2">Category</th>
                  <th className="border px-3 py-2">Price</th>
                  <th className="border px-3 py-2">Unit</th>
                  <th className="border px-3 py-2">Country</th>
                  <th className="border px-3 py-2">Description</th>
                  <th className="border px-3 py-2">Image</th>
                  <th className="border px-3 py-2">Actions</th>
                </tr>
              </thead>
<tbody>
  {products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category_name.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        p.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .map((prod, index) => (
      <tr key={prod.id}>
        <td className="border px-3 py-2">{index + 1}</td>

       
        <td className="border px-3 py-2">
          {editingProductId === prod.id ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
            />
          ) : (
            prod.name
          )}
        </td>

      
        <td className="border px-3 py-2">{prod.category_name}</td>

       
        <td className="border px-3 py-2">
          {editingProductId === prod.id ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
            />
          ) : (
            prod.price
          )}
        </td>

       
        <td className="border px-3 py-2">
          {editingProductId === prod.id ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={productForm.unit}
              onChange={(e) =>
                setProductForm({ ...productForm, unit: e.target.value })
              }
            />
          ) : (
            prod.unit
          )}
        </td>

        <td className="border px-3 py-2">
          {editingProductId === prod.id ? (
            <input
              className="border px-2 py-1 rounded w-full"
              value={productForm.country}
              onChange={(e) =>
                setProductForm({ ...productForm, country: e.target.value })
              }
            />
          ) : (
            prod.country
          )}
        </td>

        <td className="border px-3 py-2">
          {editingProductId === prod.id ? (
            <textarea
              className="border px-2 py-1 rounded w-full"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
            />
          ) : (
            prod.description
          )}
        </td>

        
        <td className="border px-3 py-2 text-center">
          {editingProductId === prod.id ? (
            <>
              <input
                type="file"
                onChange={(e) => setProductImageFile(e.target.files[0])}
              />
              {(productImageFile || productForm.image_url) && (
                <img
                  src={
                    productImageFile
                      ? URL.createObjectURL(productImageFile)
                      : productForm.image_url
                  }
                  className="w-12 h-12 mx-auto mt-2 rounded"
                />
              )}
            </>
          ) : (
            prod.image_url && (
              <img
                src={prod.image_url}
                className="w-12 h-12 mx-auto rounded"
              />
            )
          )}
        </td>

       
        <td className="border px-3 py-2 text-center">
          <div className="flex justify-center gap-2">
            {editingProductId === prod.id ? (
              <button
                onClick={() => handleUpdateProduct(prod.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => startEditProduct(prod)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => handleDeleteProduct(prod.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
</tbody>

            </table>
          </div>
        </section>
      )}
      {activeForm === "banner_list" && (
  <section>
    <h2 className="text-2xl font-bold mb-4 text-green-700">
      Banner List
    </h2>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner.id}>
              <td className="border px-4 py-2">{index + 1}</td>

              <td className="border px-4 py-2">
                {editingBannerId === banner.id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={bannerForm.title}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, title: e.target.value })
                    }
                  />
                ) : (
                  banner.title
                )}
              </td>

              <td className="border px-4 py-2 text-center">
                {editingBannerId === banner.id ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) =>
                        setBannerImageFile(e.target.files[0])
                      }
                    />
                    {(bannerImageFile || bannerForm.image_url) && (
                      <img
                        src={
                          bannerImageFile
                            ? URL.createObjectURL(bannerImageFile)
                            : bannerForm.image_url
                        }
                        className="w-20 h-12 mx-auto mt-2 rounded object-cover"
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={banner.image_url}
                    className="w-20 h-12 mx-auto rounded object-cover"
                  />
                )}
              </td>

              <td className="border px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
                  {editingBannerId === banner.id ? (
                    <button
                      onClick={() => handleUpdateBanner(banner.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditBanner(banner)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}


    </div>
  );
}

export default Catalogs;
