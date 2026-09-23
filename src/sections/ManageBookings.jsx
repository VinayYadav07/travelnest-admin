import { useState } from "react";
import { patchDB } from "../config/firebase.js";

import Status from "../components/Status.jsx";
import FilterButtons from "../components/FilterButtons.jsx";

// Format booking date
const formatDate = (date) => {
  if (!date) return "–";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Booking row component
const BookingRow = ({ booking, setBookings, toast }) => {
  // Update booking status
  const updateBookingStatus = async (newStatus) => {
    try {
      await patchDB(`bookings/${booking.id}`, { status: newStatus });

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id ? { ...item, status: newStatus } : item,
        ),
      );

      toast(
        `Booking ${newStatus}.`,
        newStatus === "approved" ? "success" : "danger",
      );
    } catch (error) {
      toast("Could not update booking.", "danger");
    }
  };

  return (
    <tr>
      <td>
        <div className="cell-prop">
          {booking.listingImage && (
            <img src={booking.listingImage} alt="" className="thumb" />
          )}

          <span>
            <strong>{booking.listingName || "–"}</strong>
          </span>
        </div>
      </td>

      <td>
        <div>{booking.userName || "–"}</div>
        <small className="muted">{booking.userEmail || "–"}</small>
      </td>

      <td>{formatDate(booking.checkIn)}</td>
      <td>{formatDate(booking.checkOut)}</td>

      <td>
        {booking.nights || 0} night
        {booking.nights > 1 ? "s" : ""}
      </td>

      <td>
        <strong>₹{booking.totalPrice?.toLocaleString() || "–"}</strong>
      </td>

      <td>
        <Status status={booking.status} />
      </td>

      <td>
        {booking.status === "pending" ? (
          <div className="btn-row">
            <button
              className="btn-mini approve"
              onClick={() => updateBookingStatus("approved")}
            >
              <i className="fa-solid fa-check me-1" />
              Approve
            </button>

            <button
              className="btn-mini reject"
              onClick={() => updateBookingStatus("rejected")}
            >
              <i className="fa-solid fa-xmark me-1" />
              Reject
            </button>
          </div>
        ) : (
          <span className="muted small">–</span>
        )}
      </td>
    </tr>
  );
};

// Manage bookings component
const ManageBookings = ({ bookings, setBookings, toast }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Filter bookings by status
  const filteredBookings = bookings.filter((booking) => {
    if (selectedFilter === "all") return true;

    return booking.status === selectedFilter;
  });

  // Sort latest bookings first
  filteredBookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

  return (
    <>
      <div className="section-head">
        <h2>Bookings</h2>

        <FilterButtons
          options={["all", "pending", "approved", "rejected"]}
          value={selectedFilter}
          onChange={setSelectedFilter}
        />
      </div>

      <div className="panel">
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="muted center">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    setBookings={setBookings}
                    toast={toast}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageBookings;
