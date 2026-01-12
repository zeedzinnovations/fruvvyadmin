import React, { useEffect, useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function MegaOffers({ activeForm }) {
  const [categories, setCategories] = useState([]);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [country, setCountry] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productPreview, setProductPreview] = useState("");
const [megaOfferLoading, setMegaOfferLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/get-categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);


  const submitMegaOffer = async () => {
  if (!productName || !categoryId || !price || !offerPrice) {
    return alert("Please fill all required fields");
  }

  try {
    setMegaOfferLoading(true);

    let imageUrl = "";
    if (productImage) {
      imageUrl = await uploadToCloudinary(productImage, "megaoffers");
      if (!imageUrl) return alert("Image upload failed");
    }

    const res = await fetch(`${API_BASE_URL}/api/megaoffers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productName.trim(),
        category_id: categoryId,
        price,
        offer_price: offerPrice,
        country,
        unit,
        description,
        image_url: imageUrl,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Server error:", errText);
      throw new Error("Failed to add mega offer");
    }

    alert("Mega Offer Product Added Successfully");

    setProductName("");
    setCategoryId("");
    setPrice("");
    setOfferPrice("");
    setCountry("");
    setUnit("");
    setDescription("");
    setProductImage(null);
    setProductPreview("");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setMegaOfferLoading(false);
  }
};

  const uniqueCategories = Object.values(
    categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {})
  );

  return (
    <div className="flex-1 p-10 flex justify-center items-center">
      {activeForm === "megaoffer" && (
        <div className="w-150 bg-white border-2 border-green-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Add Mega Offer Product
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
            placeholder="Original Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4"
          />

         
          <input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
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
  onClick={submitMegaOffer}
  disabled={megaOfferLoading}
  className="w-full bg-green-700 text-white p-3 rounded-xl disabled:opacity-50"
>
  {megaOfferLoading ? "Uploading..." : "Upload Mega Offer"}
</button>

        </div>
      )}
    </div>
  );
}

export default MegaOffers;
