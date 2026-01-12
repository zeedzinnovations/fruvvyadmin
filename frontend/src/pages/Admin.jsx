import React, { useState } from "react";
import LoadingBar from "react-top-loading-bar";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaFileInvoiceDollar,
  FaCog,
  FaSignOutAlt,
  FaCloudUploadAlt,
  FaDollarSign,
  FaBullhorn
} from "react-icons/fa";
import { PiUserListFill } from "react-icons/pi";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import OtpAuth from "../components/OtpAuth";
import Upload from "../components/Uploads";
import Catalog from "../components/Catalogs";
import Signup from "./Signup";
import AdminsList from "../components/AdminsList";
import CustomerList from "../components/CustomerList";
import MegaOffers from "../components/MegaOffers";



function DashboardStats() {
  const stats = [
    { label: "Products", value: 120, icon: FaBoxOpen },
    { label: "Orders", value: 56, icon: FaShoppingCart },
    { label: "Customers", value: 230, icon: FaUsers },
    { label: "Revenue", value: "$4,800", icon: FaDollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {stats.map((item, index) => (
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

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
      ${active ? "bg-white text-green-700 font-semibold" : "text-white hover:bg-white hover:text-green-700"}`}
    >
      <Icon />
      <span>{label}</span>
    </li>
  );
}


export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    role: "Admin",
  };

  const [activeView, setActiveView] = useState("dashboard");
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("");
  const [progress, setProgress] = useState(0);

  const handleNavigation = (view, form = "") => {
    setProgress(30);
    setActiveView(view);
    setActiveForm(form);
    setTimeout(() => setProgress(100), 500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FFFA]">

    
      <LoadingBar
        color="#15803d"
        progress={progress}
        onLoaderFinished={() => setProgress(2)}
      />

      {/* SIDEBAR */}
      <aside className="w-72 bg-green-700 text-white p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl bg-white text-green-700 py-3 rounded-xl flex justify-center gap-2 mb-6">
            <FaTachometerAlt /> Admin Dashboard
          </h1>

          <ul className="space-y-2">

            <SidebarItem
              icon={FaTachometerAlt}
              label="Dashboard"
              active={activeView === "dashboard"}
              onClick={() => handleNavigation("dashboard")}
            />

            <SidebarItem
              icon={FaUsers}
              label="Add User Admin"
              active={activeView === "signup"}
              onClick={() => handleNavigation("signup")}
            />

            <SidebarItem
              icon={PiUserListFill}
              label="List of Admins"
              active={activeView === "users"}
              onClick={() => handleNavigation("users")}
            />

            <SidebarItem
              icon={FaBullhorn}
              label="Mega Offers"
              active={activeView === "megaoffers"}
              onClick={() => handleNavigation("megaoffers", "megaoffer")}
            />

            <SidebarItem
              icon={FaUsers}
              label="List of Customers"
              active={activeView === "customers"}
              onClick={() => handleNavigation("customers")}
            />

            <SidebarItem
              icon={FaChartBar}
              label="OTP List"
              active={activeView === "otp"}
              onClick={() => handleNavigation("otp")}
            />

            {/* PRODUCTS */}
            <li>
              <div
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white hover:text-green-700 rounded-lg"
              >
                <FaBoxOpen /> Products
                <span className="ml-auto">
                  {catalogOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                </span>
              </div>

              {catalogOpen && (
                <ul className="ml-8 mt-2 space-y-2 text-sm">
                  <li onClick={() => handleNavigation("catalog", "category_list")} className="cursor-pointer hover:text-green-300">
                    Category List
                  </li>
                  <li onClick={() => handleNavigation("catalog", "product_list")} className="cursor-pointer hover:text-green-300">
                    Product List
                  </li>
                </ul>
              )}
            </li>

            {/* UPLOAD */}
            <li>
              <div
                onClick={() => setUploadOpen(!uploadOpen)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white hover:text-green-700 rounded-lg"
              >
                <FaCloudUploadAlt /> Upload
                <span className="ml-auto">
                  {uploadOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                </span>
              </div>

              {uploadOpen && (
                <ul className="ml-8 mt-2 space-y-2 text-sm">
                  <li onClick={() => handleNavigation("upload", "category")} className="cursor-pointer hover:text-green-300">
                    Upload Category
                  </li>
                  <li onClick={() => handleNavigation("upload", "product")} className="cursor-pointer hover:text-green-300">
                    Upload Product
                  </li>
                  <li onClick={() => handleNavigation("upload", "bannerimages")} className="cursor-pointer hover:text-green-300">
                    Upload Images
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>

        {/* FOOTER */}
        <div>
          <div className="bg-white text-green-700 p-3 rounded-md">
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm">{user.role}</div>
          </div>

          <button
            className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-white hover:bg-white hover:text-green-700"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.reload();
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {activeView === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-green-700">Dashboard Overview</h1>
            <DashboardStats />
          </>
        )}

        {activeView === "otp" && <OtpAuth />}
        {activeView === "upload" && <Upload activeForm={activeForm} />}
        {activeView === "catalog" && <Catalog activeForm={activeForm} />}
        {activeView === "megaoffers" && <MegaOffers activeForm={activeForm} />}
        {activeView === "signup" && <Signup />}
        {activeView === "users" && <AdminsList />}
        {activeView === "customers" && <CustomerList />}
      </main>
    </div>
  );
}
