import React, { useEffect, useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Update({ activeForm }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState("");
  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [country, setCountry] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productPreview, setProductPreview] = useState("");
  const [products, setProducts] = useState([]);

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

  // ================= ADD CATEGORY =================
  const submitCategory = async () => {
    if (!categoryName.trim()) {
      return alert("Enter category name");
    }

    // ✅ Case-insensitive duplicate check
    const categoryExists = categories.some(
      (cat) =>
        cat.name.trim().toLowerCase() ===
        categoryName.trim().toLowerCase()
    );

    if (categoryExists) {
      return alert("Category already exists");
    }

    let imageUrl = "";

    if (categoryImage) {
      imageUrl = await uploadToCloudinary(categoryImage, "categories");
      if (!imageUrl) return alert("Image upload failed");
    }

    await fetch(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName.trim(),
        image_url: imageUrl,
      }),
    });

    alert("Category added successfully");

    setCategoryName("");
    setCategoryImage(null);
    setCategoryPreview("");

    const res = await fetch(`${API_BASE_URL}/api/get-categories`);
    setCategories(await res.json());
  };

  // ================= ADD PRODUCT =================
  const submitProduct = async () => {
    if (!productName || !categoryId) {
      return alert("Fill required fields");
    }

    let imageUrl = "";

    if (productImage) {
      imageUrl = await uploadToCloudinary(productImage, "products");
      if (!imageUrl) return alert("Image upload failed");
    }

    await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productName.trim(),
        category_id: categoryId,
        price,
        country,
        unit,
        description,
        image_url: imageUrl,
      }),
    });

    alert("Product added successfully");

    setProductName("");
    setCategoryId("");
    setPrice("");
    setCountry("");
    setUnit("");
    setDescription("");
    setProductImage(null);
    setProductPreview("");

    const res = await fetch(`${API_BASE_URL}/api/get-products`);
    setProducts(await res.json());
  };

  // Remove duplicate categories if API returns duplicates
  const uniqueCategories = Object.values(
    categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {})
  );

  return (
    <div className="flex-1 p-10 flex justify-center items-center">
      {/* ================= CATEGORY FORM ================= */}
      {activeForm === "category" && (
        <div className="w-md bg-white border-2 border-green-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Add Category
          </h2>

          <input
            type="text"
            placeholder="Category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setCategoryImage(e.target.files[0]);
              setCategoryPreview(
                e.target.files[0]
                  ? URL.createObjectURL(e.target.files[0])
                  : ""
              );
            }}
          />

          {categoryPreview && (
            <img src={categoryPreview} className="mt-4 h-32 rounded" />
          )}

          <button
            onClick={submitCategory}
            className="w-full bg-green-700 text-white py-3 rounded-lg mt-4"
          >
            Submit Category
          </button>
        </div>
      )}

      {/* ================= PRODUCT FORM ================= */}
      {activeForm === "product" && (
        <div className="w-150 bg-white border-2 border-green-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Add Product
          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          >
            <option value="">Select Category</option>
            {uniqueCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            type="text"
            placeholder="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProductImage(e.target.files[0]);
              setProductPreview(
                e.target.files[0]
                  ? URL.createObjectURL(e.target.files[0])
                  : ""
              );
            }}
            className="mb-4"
          />

          {productPreview && (
            <img
              src={productPreview}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
          )}

          <button
            onClick={submitProduct}
            className="w-full bg-green-700 text-white p-3 rounded-xl"
          >
            Add Product
          </button>
        </div>
      )}
    </div>
  );
}

export default Update;



  