import { logoutAdmin, getAdminName } from "../config/firebase.js";

// Sidebar menu items
const MENU_ITEMS = [
  { id: "overview", icon: "fa-chart-pie", label: "Overview" },
  { id: "categories", icon: "fa-tags", label: "Categories" },
  { id: "listings", icon: "fa-hotel", label: "Listings" },
  { id: "bookings", icon: "fa-calendar-check", label: "Bookings" },
];

// Sidebar component
const Sidebar = ({ currentPage, onChange, isOpen, onClose }) => {
  // Handle admin logout
  const handleLogout = () => {
    logoutAdmin();
    window.location.href = "/login";
  };

  return (
    <>
      {isOpen && <div className="drawer-mask" onClick={onClose} />}

      <aside className={`sidenav${isOpen ? " open" : ""}`}>
        {/* Brand */}
        <div className="sidenav-brand">
          <i className="fa-solid fa-plane-departure" />

          <span>
            Travel<strong>Nest</strong>
          </span>

          <em>ADMIN</em>
        </div>

        {/* Navigation menu */}
        <nav className="sidenav-nav">
          <p className="sidenav-heading">Manage</p>

          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidenav-link${
                currentPage === item.id ? " active" : ""
              }`}
              onClick={() => {
                onChange(item.id);
                onClose();
              }}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </button>
          ))}

          <p className="sidenav-heading mt-3">Account</p>

          <button className="sidenav-link logout" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Admin information */}
        <div className="sidenav-foot">
          <i className="fa-solid fa-circle-user" />
          <span>{getAdminName()}</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
