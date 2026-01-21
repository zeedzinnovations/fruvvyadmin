import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBoxOpen,
  FaUsers,
  FaBullhorn,
  FaExclamationTriangle,
  FaRupeeSign
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    mega_offers: 0,
    low_stock: 0,
    today_sales: 0,
    fruits: 0,
    vegetables: 0,
    dairy: 0,
    featured_products: [], // Always an array to prevent errors
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/dashboard`);
        setStats({
          ...res.data,
          featured_products: res.data.featured_products || [], // ensure array
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: FaBoxOpen },
    { label: "Categories", value: stats.categories, icon: BiSolidCategory },
    { label: "Customers", value: stats.customers, icon: FaUsers },
    { label: "Mega Offers", value: stats.mega_offers, icon: FaBullhorn },
    { label: "Low Stock", value: stats.low_stock, icon: FaExclamationTriangle },

    { label: "Fruits", value: stats.fruits, icon: FaBoxOpen },
    { label: "Vegetables", value: stats.vegetables, icon: FaBoxOpen },
    { label: "Dairy", value: stats.dairy, icon: FaBoxOpen },
  ];

  return (
    <div className="p-6 space-y-10">
      {/* Banner */}
      <div className="bg-green-100 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Welcome to Fruvvy Dashboard</h1>
          <p className="text-green-700">Monitor your store's inventory and sales at a glance!!!!</p>
        </div>
        <img
          src="https://centerforfamilymedicine.com/wp-content/uploads/2020/06/Center-for-family-medicine-The-Health-Benefits-of-Eating-10-Servings-Of-Fruits-_-Veggies-Per-Day-800x531.jpg"
          alt="Grocery Banner"
          className="rounded-full w-100 h-60"
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
            <c.icon className="text-green-700 text-2xl" />
            <div>
              <div className="text-sm text-gray-500">{c.label}</div>
              <div className="text-xl font-bold text-green-700">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        {(stats.featured_products || []).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(stats.featured_products || []).map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <div className="text-green-700 font-semibold text-center">{p.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No featured products yet</div>
        )}
      </div>
    </div>
  );
}
