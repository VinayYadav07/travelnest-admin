import { useEffect, useState } from "react";

import {
  readDB,
  objToArr,
  FALLBACK_LISTINGS,
  FALLBACK_CATEGORIES,
  FALLBACK_BOOKINGS,
} from "../config/firebase.js";

import Sidebar from "../components/Sidebar.jsx";
import Notification from "../components/Notification.jsx";

import DashboardOverview from "../sections/DashboardOverview.jsx";
import ManageCategories from "../sections/ManageCategories.jsx";
import ManageListings from "../sections/ManageListings.jsx";
import ManageBookings from "../sections/ManageBookings.jsx";

// Notification dikhane ke liye
const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({
      message: message,
      type: type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  return {
    showNotification: showNotification,
    notification: notification,
  };
};

// Page ke naam
const PAGE_TITLE = {
  overview: "Dashboard",
  categories: "Categories",
  listings: "Listings",
  bookings: "Bookings",
};

// Admin dashboard component
const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const { showNotification, notification } = useNotification();

  // Firebase se dashboard data lana
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const listingsData = await readDB("listings");
        const categoriesData = await readDB("categories");
        const bookingsData = await readDB("bookings");

        if (listingsData) {
          setListings(objToArr(listingsData));
        } else {
          setListings(FALLBACK_LISTINGS);
        }

        if (categoriesData) {
          setCategories(objToArr(categoriesData));
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }

        if (bookingsData) {
          setBookings(objToArr(bookingsData));
        } else {
          setBookings(FALLBACK_BOOKINGS);
        }
      } catch (error) {
        console.error("Dashboard data error:", error);

        setListings(FALLBACK_LISTINGS);
        setCategories(FALLBACK_CATEGORIES);
        setBookings(FALLBACK_BOOKINGS);
      }

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <div className="shell">
      <Notification notification={notification} />

      <Sidebar
        currentPage={currentPage}
        onChange={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="shell-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="burger"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fa-solid fa-bars" />
            </button>

            <h1>{PAGE_TITLE[currentPage]}</h1>
          </div>

          <div className="topbar-right">
            <i className="fa-solid fa-circle-user" />
            <span>{adminName}</span>
          </div>
        </header>

        <section className="content">
          {isLoading ? (
            <div className="loader">
              <div className="spinner-border" />
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <>
              {currentPage === "overview" && (
                <DashboardOverview
                  listings={listings}
                  categories={categories}
                  bookings={bookings}
                  setBookings={setBookings}
                  toast={showNotification}
                />
              )}

              {currentPage === "categories" && (
                <ManageCategories
                  listings={listings}
                  categories={categories}
                  setCategories={setCategories}
                  toast={showNotification}
                />
              )}

              {currentPage === "listings" && (
                <ManageListings
                  listings={listings}
                  setListings={setListings}
                  categories={categories}
                  toast={showNotification}
                />
              )}

              {currentPage === "bookings" && (
                <ManageBookings
                  bookings={bookings}
                  setBookings={setBookings}
                  toast={showNotification}
                />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
