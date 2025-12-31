import React, { useState, useEffect } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Catalogs({ activeForm }) {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

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

//delete
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

  //update
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
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
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

    <input
      type="text"
      placeholder="Search..."
      className="mb-4 px-4 py-2 border rounded-lg"
      value={productSearch}
      onChange={(e) => setProductSearch(e.target.value)}
    />

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border text-left">ID</th>
            <th className="px-4 py-3 border text-left">Product Name</th>
            <th className="px-4 py-3 border text-left">Category</th>
            <th className="px-4 py-3 border">Price</th>
            <th className="px-4 py-3 border">Unit</th>
            <th className="px-4 py-3 border">Country</th>
            <th className="px-4 py-3 border text-left">Description</th>
            <th className="px-4 py-3 border text-center">Image</th>
            <th className="px-4 py-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter(
              (p) =>
                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.category_name
                  .toLowerCase()
                  .includes(productSearch.toLowerCase())
            )
            .map((prod, index) => (
              <tr key={prod.id} className="hover:bg-gray-50 transition">
               
                <td className="px-4 py-3 border">{index + 1}</td>

                <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    prod.name
                  )}
                </td>

            
                <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.category_id}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    prod.category_name
                  )}
                </td>

              
                <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <input
                      type="number"
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    prod.price
                  )}
                </td>

                   <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.unit}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          unit: e.target.value,
                        })
                      }
                    />
                  ) : (
                    prod.unit || "-"
                  )}
                </td>

              
                <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <input
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.country}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          country: e.target.value,
                        })
                      }
                    />
                  ) : (
                    prod.country || "-"
                  )}
                </td>

               
                <td className="px-4 py-3 border">
                  {editingProductId === prod.id ? (
                    <textarea
                      className="border px-2 py-1 rounded w-full"
                      value={productForm.description || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    prod.description || "-"
                  )}
                </td>

             
                <td className="px-4 py-3 border text-center">
                  {editingProductId === prod.id ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setProductImageFile(e.target.files[0])
                        }
                      />
                      {(productImageFile || productForm.image_url) && (
                        <img
                          src={
                            productImageFile
                              ? URL.createObjectURL(productImageFile)
                              : productForm.image_url
                          }
                          className="w-12 h-12 mx-auto mt-2 rounded object-cover"
                        />
                      )}
                    </>
                  ) : (
                    prod.image_url && (
                      <img
                        src={prod.image_url}
                        className="w-12 h-12 mx-auto rounded object-cover"
                      />
                    )
                  )}
                </td>

                <td className="px-4 py-3 border text-center">
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
  </section>     )}
    </div>
  );
}

export default Catalogs;
