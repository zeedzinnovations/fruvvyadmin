import React, { useState } from "react";
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
} from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { CgUserList } from "react-icons/cg";

import OtpAuth from "../components/OtpAuth";
import Upload from "../components/Uploads";
import Catalog from "../components/Catalogs";
import Signup from "./Signup";
import AdminsList from '../components/AdminsList'
import CustomerList from '../components/CustomerList'

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
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4"
        >
          <item.icon className="text-green-700 text-2xl" />
          <div>
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-xl font-bold text-green-700">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function QuickActions() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mt-8">
      <h2 className="text-lg font-semibold text-green-700 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-4">
        <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
          Add Product
        </button>
        <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
          Upload Category
        </button>
        <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
          View Orders
        </button>
      </div>
    </div>
  );
}


function RecentActivity() {
  const activities = [
    "New product added",
    "Order #1121 placed",
    "Customer registered",
    "Category updated",
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mt-8">
      <h2 className="text-lg font-semibold text-green-700 mb-4">
        Recent Activity
      </h2>
      <ul className="space-y-2 text-gray-600">
        {activities.map((activity, index) => (
          <li key={index}>• {activity}</li>
        ))}
      </ul>
    </div>
  );
}


function SidebarItem({ icon: Icon, label, active, onClick }) {
  const classes = active
    ? "flex items-center gap-3 p-3 rounded-lg bg-white text-green-700 font-semibold cursor-pointer"
    : "flex items-center gap-3 p-3 rounded-lg text-white hover:bg-white hover:text-green-700 transition cursor-pointer";

  return (
    <li className={classes} onClick={onClick}>
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

  return (
    <div className="flex min-h-screen bg-[#F8FFFA]">
    
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
              onClick={() => setActiveView("dashboard")}
            />

            <SidebarItem
              icon={FiUsers}
              label="Add User Admin"
              active={activeView === "signup"}
              onClick={() => setActiveView("signup")}
            />
<SidebarItem
  icon={CgUserList}
  label="List of Admins"
  active={activeView === "users"}
  onClick={() => setActiveView("users")}
/>

            <SidebarItem
              icon={FaShoppingCart}
              label="Orders"
              active={activeView === "orders"}
              onClick={() => setActiveView("orders")}
            />

            <SidebarItem
              icon={FaUsers}
              label="List of Customers"
              active={activeView === "customers"}
              onClick={() => setActiveView("customers")}
            />
             

            <SidebarItem
              icon={FaChartBar}
              label="OTP LIST"
              active={activeView === "otp"}
              onClick={() => setActiveView("otp")}
            />

            {/* Products List*/}
            <li>
              <div
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white hover:text-green-700"
              >
                <FaBoxOpen/> Products
                <span className="ml-auto">
                  {catalogOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                </span>
              </div>

              {catalogOpen && (
                <ul className="ml-8 mt-2 space-y-2 text-sm">
                  <li
                    onClick={() => {
                      setActiveView("catalog");
                      setActiveForm("category_list");
                    }}
                    className="cursor-pointer hover:text-green-300"
                  >
                    Category List
                  </li>
                  <li
                    onClick={() => {
                      setActiveView("catalog");
                      setActiveForm("product_list");
                    }}
                    className="cursor-pointer hover:text-green-300"
                  >
                    Product List
                  </li>
                </ul>
              )}
            </li>

            {/* Upload*/}
            <li>
              <div
                onClick={() => setUploadOpen(!uploadOpen)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white hover:text-green-700"
              >
                <FaCloudUploadAlt /> Upload
                <span className="ml-auto">
                  {uploadOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                </span>
              </div>

              {uploadOpen && (
                <ul className="ml-8 mt-2 space-y-2 text-sm">
                  <li
                    onClick={() => {
                      setActiveView("upload");
                      setActiveForm("category");
                    }}
                    className="cursor-pointer hover:text-green-300"
                  >
                    Upload Category
                  </li>
                  <li
                    onClick={() => {
                      setActiveView("upload");
                      setActiveForm("product");
                    }}
                    className="cursor-pointer hover:text-green-300"
                  >
                    Upload Product
                  </li>
                </ul>
              )}
            </li>

            <SidebarItem
              icon={FaFileInvoiceDollar}
              label="Invoices"
              active={activeView === "invoices"}
              onClick={() => setActiveView("invoices")}
            />

            <SidebarItem
              icon={FaCog}
              label="Settings"
              active={activeView === "settings"}
              onClick={() => setActiveView("settings")}
            />
          </ul>
        </div>

       
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

      
      <main className="flex-1 p-8">
        {activeView === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-green-700">
              Dashboard Overview
            </h1>
            <DashboardStats />
            <QuickActions />
            <RecentActivity />
          </>
        )}

        {activeView === "otp" && <OtpAuth />}
        {activeView === "upload" && <Upload activeForm={activeForm} />}
        {activeView === "catalog" && <Catalog activeForm={activeForm} />}
        {activeView === "signup" && <Signup />}
        {activeView === "users" && <AdminsList />}
           {activeView === "customers" && <CustomerList />}


        {activeView !== "dashboard" &&
          activeView !== "otp" &&
          activeView !== "upload" &&
          activeView !== "catalog"
        }
      </main>
    </div>
  );
}
