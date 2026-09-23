import StatsCard from "../components/StatsCard.jsx";
import Status from "../components/Status.jsx";

// Format booking date
const formatDate = (date) => {
  if (!date) return "–";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Dashboard overview component
const DashboardOverview = ({
  listings = [],
  categories = [],
  bookings = [],
}) => {
  // Dashboard statistics
  const stats = [
    {
      icon: "fa-hotel",
      color: "#0f6b5c",
      value: listings.length,
      label: "Total Listings",
    },
    {
      icon: "fa-calendar-check",
      color: "#3b82f6",
      value: bookings.length,
      label: "Total Bookings",
    },
    {
      icon: "fa-hourglass-half",
      color: "#f59e0b",
      value: bookings.filter((b) => b.status === "pending").length,
      label: "Pending",
    },
    {
      icon: "fa-tags",
      color: "#10b981",
      value: categories.length,
      label: "Categories",
    },
  ];

  // Get the 5 most recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    .slice(0, 5);

  return (
    <>
      <div className="stat-grid">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>
            <i className="fa-solid fa-clock-rotate-left" />
            Recent Bookings
          </h3>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Guest</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Nights</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="muted center">
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="cell-prop">
                        {booking.listingImage && (
                          <img
                            src={booking.listingImage}
                            alt=""
                            className="thumb"
                          />
                        )}

                        <span>{booking.listingName || "–"}</span>
                      </div>
                    </td>

                    <td>
                      <div>{booking.userName || "–"}</div>
                      <small className="muted">{booking.userEmail}</small>
                    </td>

                    <td>{formatDate(booking.checkIn)}</td>

                    <td>{formatDate(booking.checkOut)}</td>

                    <td>
                      {booking.nights} night
                      {booking.nights > 1 ? "s" : ""}
                    </td>

                    <td>₹{booking.totalPrice?.toLocaleString() || "–"}</td>

                    <td>
                      <Status status={booking.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
