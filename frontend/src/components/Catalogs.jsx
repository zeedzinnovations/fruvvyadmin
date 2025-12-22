import React, { useState, useEffect } from "react";

function Catalogs({ activeForm }) {
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/get-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/api/get-products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Delete 
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((prod) => prod.id !== id));
  };

  return (
    <div>
      {/* Category List Table */}
      {activeForm === "category_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#00713E" }}>
            Categories List
          </h2>
          <input
            type="text"
            placeholder="Search by Category ID..."
            className="mb-4 px-4 py-2 border-2 rounded-lg outline-none w-full max-w-sm"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Category Name</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .filter((cat) =>
                    categorySearch ? cat.id.toString().includes(categorySearch) : true
                  )
                  .map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-4 py-2 border">{cat.id}</td>
                      <td className="px-4 py-2 border">{cat.name}</td>
                      <td className="px-4 py-2 border">
                        {cat.image_url && (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Product List Table */}
      {activeForm === "product_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "#00713E" }}>
            Product List
          </h2>
          <input
            type="text"
            placeholder="Search by Product ID ..."
            className="mb-4 px-4 py-2 border-2 rounded-lg outline-none w-full max-w-sm"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Category ID</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Country</th>
                  <th className="px-4 py-2 border">Unit</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((prod) =>
                    productSearch ? prod.id.toString().includes(productSearch) : true
                  )
                  .map((prod) => (
                    <tr key={prod.id}>
                      <td className="px-4 py-2 border">{prod.id}</td>
                      <td className="px-4 py-2 border">{prod.name}</td>
                      <td className="px-4 py-2 border">{prod.category_id}</td>
                      <td className="px-4 py-2 border">{prod.price}</td>
                      <td className="px-4 py-2 border">{prod.country}</td>
                      <td className="px-4 py-2 border">{prod.unit}</td>
                      <td className="px-4 py-2 border">{prod.description}</td>
                      <td className="px-4 py-2 border">
                        {prod.image_url && (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
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
