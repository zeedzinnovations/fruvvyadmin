import React, { useState, useEffect } from "react";

function Uploads({ activeForm }) {
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
    fetch("https://fruvvyadmin.onrender.com/api/get-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("https://fruvvyadmin.onrender.com/api/get-products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);


  const uploadToCloudinary = async (file, folder) => {
    try {
      const sigRes = await fetch(
        `https://fruvvyadmin.onrender.com/api/cloudinary-signature?folder=${folder}`
      );
      const sig = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sig.apiKey);
      formData.append("timestamp", sig.timestamp);
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) throw new Error("Upload failed");

      const data = await uploadRes.json();
      return data.secure_url;
    } catch (err) {
      alert("Cloudinary upload failed");
      return "";
    }
  };


  const submitCategory = async () => {
    if (!categoryName) return alert("Enter category name");

    let imageUrl = "";
    if (categoryImage) {
      imageUrl = await uploadToCloudinary(
        categoryImage,
        "fruvvy_images/categories"
      );
    }

    await fetch("https://fruvvyadmin.onrender.com/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName, image_url: imageUrl }),
    });

    alert("Category added");
    setCategoryName("");
    setCategoryImage(null);
    setCategoryPreview("");

    const res = await fetch("https://fruvvyadmin.onrender.com/api/get-categories");
    setCategories(await res.json());
  };

 
  const submitProduct = async () => {
    if (!productName || !categoryId) return alert("Fill required fields");

    let imageUrl = "";
    if (productImage) {
      imageUrl = await uploadToCloudinary(
        productImage,
        "fruvvy_images/products"
      );
    }

    await fetch("https://fruvvyadmin.onrender.com/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productName,
        category_id: categoryId,
        price,
        country,
        unit,
        description,
        image_url: imageUrl,
      }),
    });

    alert("Product added");
    setProductName("");
    setCategoryId("");
    setPrice("");
    setCountry("");
    setUnit("");
    setDescription("");
    setProductImage(null);
    setProductPreview("");

    const res = await fetch("https://fruvvyadmin.onrender.com/api/get-products");
    setProducts(await res.json());
  };

  const uniqueCategories = Object.values(
    categories.reduce((acc, cat) => {
      const key = cat.name.toLowerCase();
      if (!acc[key]) acc[key] = cat;
      return acc;
    }, {})
  );

  return (
    <div className="flex-1 p-10 flex justify-center items-center">
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
            onChange={(e) => {
              if (e.target.files[0]) {
                setCategoryImage(e.target.files[0]);
                setCategoryPreview(URL.createObjectURL(e.target.files[0]));
              }
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
      {/* Product Form */}
      {activeForm === "product" && (
        <div className="w-175 bg-white border-2 border-green-700 rounded-xl p-8">
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
              if (e.target.files[0]) {
                setProductImage(e.target.files[0]);
                setProductPreview(URL.createObjectURL(e.target.files[0]));
              }
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

export default Uploads;
