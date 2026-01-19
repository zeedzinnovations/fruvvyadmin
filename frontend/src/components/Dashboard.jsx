import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaUsers ,  FaBullhorn} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";

const API_BASE_URL = import.meta.env.VITE_API_URL;


function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    mega_offers:0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/dashboard-counts`)
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard counts", err);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: FaBoxOpen },
    { label: "Categories", value: stats.categories, icon: BiSolidCategory },
    { label: "Customers", value: stats.customers, icon: FaUsers },
      { label: "Mega Offers", value: stats.mega_offers, icon:   FaBullhorn },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {cards.map((item, index) => (
        <div key={index} className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4">
          <item.icon className="text-green-700 text-2xl" />
          <div>
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-xl font-bold text-green-700">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
