import { useState } from "react";

import { pushDB, patchDB, removeDB } from "../config/firebase.js";

import Popup from "../components/Popup.jsx";
import InputField from "../components/InputField.jsx";

// Empty listing form
const EMPTY_FORM = {
  name: "",
  category: "",
  city: "",
  pincode: "",
  price: "",
  description: "",
  images: "",
  available: true,
};

// Manage listings component
const ManageListings = ({ listings, setListings, categories, toast }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Open popup for adding or editing a listing
  const openPopup = (listing) => {
    setEditingId(listing?.id || null);

    if (listing) {
      setForm({
        ...listing,
        images: (listing.images || []).join("\n"),
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setIsPopupOpen(true);
  };

  // Update one field in the form
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save new listing or update existing listing
  const saveListing = async () => {
    if (
      !form.name.trim() ||
      !form.category ||
      !form.city.trim() ||
      !form.pincode.trim() ||
      !form.price
    ) {
      toast("Please fill all required fields.", "warning");
      return;
    }

    const data = {
      ...form,
      name: form.name.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      price: Number(form.price),
      images: form.images
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    delete data.id;

    try {
      if (editingId) {
        await patchDB(`listings/${editingId}`, data);

        setListings((current) =>
          current.map((item) =>
            item.id === editingId ? { id: editingId, ...data } : item,
          ),
        );
      } else {
        const result = await pushDB("listings", data);

        setListings((current) => [
          ...current,
          {
            id: result.name,
            ...data,
          },
        ]);
      }

      setIsPopupOpen(false);
      setForm(EMPTY_FORM);
      setEditingId(null);

      toast("Listing saved!", "success");
    } catch (error) {
      toast("Could not save listing.", "danger");
    }
  };

  // Delete listing
  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await removeDB(`listings/${id}`);

      setListings((current) => current.filter((item) => item.id !== id));

      toast("Listing deleted.", "danger");
    } catch (error) {
      toast("Could not delete listing.", "danger");
    }
  };

  // Update listing availability
  const toggleAvailable = async (id, available) => {
    try {
      await patchDB(`listings/${id}`, { available });

      setListings((current) =>
        current.map((item) => (item.id === id ? { ...item, available } : item)),
      );

      toast(available ? "Marked available." : "Marked unavailable.", "success");
    } catch (error) {
      toast("Could not update availability.", "danger");
    }
  };

  // Prepare image URLs for preview
  const previewImages = form.images
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return (
    <>
      <div className="section-head">
        <h2>Listings</h2>

        <button className="btn-primary-tn" onClick={() => openPopup(null)}>
          <i className="fa-solid fa-plus me-2" />
          New Listing
        </button>
      </div>

      <div className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>City</th>
                <th>Price/night</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="muted center">
                    No listings yet.
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <img
                        src={listing.images?.[0]}
                        className="thumb"
                        alt={listing.name}
                        onError={(event) => {
                          event.target.src =
                            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100";
                        }}
                      />
                    </td>

                    <td>
                      <strong>{listing.name}</strong>
                    </td>

                    <td>
                      <span className="pill pill-approved">
                        {listing.category}
                      </span>
                    </td>

                    <td>{listing.city}</td>

                    <td>₹{listing.price?.toLocaleString() || "–"}</td>

                    <td>
                      <input
                        type="checkbox"
                        checked={listing.available !== false}
                        onChange={(event) =>
                          toggleAvailable(listing.id, event.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <div className="btn-row">
                        <button
                          className="btn-mini edit"
                          onClick={() => openPopup(listing)}
                        >
                          <i className="fa-solid fa-pen me-1" />
                          Edit
                        </button>

                        <button
                          className="btn-mini delete"
                          onClick={() => deleteListing(listing.id)}
                        >
                          <i className="fa-solid fa-trash me-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Popup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={editingId ? "Edit Listing" : "New Listing"}
        wide
        footer={
          <>
            <button className="btn-ghost" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </button>

            <button className="btn-primary-tn" onClick={saveListing}>
              Save Listing
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <InputField
              label="Place Name"
              icon="fa-hotel"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Azure Cliff Villa"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="field">
              <span>Category *</span>

              <div className="field-input">
                <i className="fa-solid fa-tags" />

                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  style={{
                    border: "none",
                    outline: "none",
                    flex: 1,
                    background: "transparent",
                  }}
                >
                  <option value="">Select...</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="col-md-6">
            <InputField
              label="City"
              icon="fa-location-dot"
              value={form.city}
              onChange={(value) => updateField("city", value)}
              placeholder="Goa"
              required
            />
          </div>

          <div className="col-md-6">
            <InputField
              label="PIN Code"
              icon="fa-map-pin"
              value={form.pincode}
              onChange={(value) => updateField("pincode", value)}
              placeholder="403004"
              maxLength={6}
              required
            />
          </div>

          <div className="col-12">
            <InputField
              label="Price per Night (₹)"
              icon="fa-indian-rupee-sign"
              type="number"
              value={form.price}
              onChange={(value) => updateField("price", value)}
              placeholder="5000"
              required
            />
          </div>

          <div className="col-12">
            <label className="field">
              <span>Description</span>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the property..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </label>
          </div>

          <div className="col-12">
            <label className="field">
              <span>Image URLs (one per line)</span>

              <textarea
                value={form.images}
                onChange={(event) => updateField("images", event.target.value)}
                placeholder={
                  "https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                }
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </label>

            {previewImages.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {previewImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    style={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                    onError={(event) => {
                      event.target.style.display = "none";
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-12">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.available}
                onChange={(event) =>
                  updateField("available", event.target.checked)
                }
              />

              <span className="small fw-semibold">Mark as Available</span>
            </label>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default ManageListings;
