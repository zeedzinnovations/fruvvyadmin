import React, { useState, useEffect } from "react";

const API= import.meta.env.VITE_API_URL;

function Catalogs({ activeForm }) {
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");


  useEffect(() => {
    fetch(`${API}/api/get-categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Category fetch error", err));
  }, []);


  useEffect(() => {
    fetch(`${API}/api/get-products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Product fetch error", err));
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    await fetch(`${API}/api/categories/${id}`, {
      method: "DELETE",
    });

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };


  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await fetch(`${API}/api/products/${id}`, {
      method: "DELETE",
    });

    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  return (
    <div>
      {/*  CATEGORY LIST  */}
      {activeForm === "category_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Categories List
          </h2>

          <input
            type="text"
            placeholder="Search by Category ID..."
            className="mb-4 px-4 py-2 border-2 rounded-lg w-full max-w-sm"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories
                  .filter((cat) =>
                    categorySearch
                      ? cat.id.toString().includes(categorySearch)
                      : true
                  )
                  .map((cat) => (
                    <tr key={cat.id}>
                      <td className="border px-4 py-2">{cat.id}</td>
                      <td className="border px-4 py-2">{cat.name}</td>
                      <td className="border px-4 py-2">
                        {cat.image_url && (
                          <img
                            src={cat.image_url}
                            alt={cat.name}
                            className="w-12 h-12 rounded"
                          />
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
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

      {/*  PRODUCT LIST */}
      {activeForm === "product_list" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-green-700">
            Product List
          </h2>

          <input
            type="text"
            placeholder="Search by Product ID..."
            className="mb-4 px-4 py-2 border-2 rounded-lg w-full max-w-sm"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Country</th>
                  <th className="border px-4 py-2">Unit</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Image</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products
                  .filter((prod) =>
                    productSearch
                      ? prod.id.toString().includes(productSearch)
                      : true
                  )
                  .map((prod) => (
                    <tr key={prod.id}>
                      <td className="border px-4 py-2">{prod.id}</td>
                      <td className="border px-4 py-2">{prod.name}</td>
                      <td className="border px-4 py-2">
                        {prod.category_id}
                      </td>
                      <td className="border px-4 py-2">{prod.price}</td>
                      <td className="border px-4 py-2">{prod.country}</td>
                      <td className="border px-4 py-2">{prod.unit}</td>
                      <td className="border px-4 py-2">
                        {prod.description}
                      </td>
                      <td className="border px-4 py-2">
                        {prod.image_url && (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-12 rounded"
                          />
                        )}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
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
