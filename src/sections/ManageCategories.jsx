import { useState } from "react";

import { pushDB, patchDB, removeDB } from "../config/firebase.js";

import Popup from "../components/Popup.jsx";
import InputField from "../components/InputField.jsx";

// Manage categories component
const ManageCategories = ({ listings, categories, setCategories, toast }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Open popup for adding or editing a category
  const openCategoryPopup = (category) => {
    setEditingCategoryId(category?.id || null);
    setCategoryName(category?.name || "");
    setIsPopupOpen(true);
  };

  // Save new category or update existing category
  const saveCategory = async () => {
    const cleanName = categoryName.trim();

    if (!cleanName) {
      toast("Enter a category name.", "warning");
      return;
    }

    try {
      if (editingCategoryId) {
        await patchDB(`categories/${editingCategoryId}`, {
          name: cleanName,
        });

        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategoryId
              ? { ...category, name: cleanName }
              : category,
          ),
        );
      } else {
        const result = await pushDB("categories", {
          name: cleanName,
        });

        setCategories((current) => [
          ...current,
          {
            id: result.name,
            name: cleanName,
          },
        ]);
      }

      setIsPopupOpen(false);
      setCategoryName("");
      setEditingCategoryId(null);

      toast("Category saved!", "success");
    } catch (error) {
      toast("Could not save category.", "danger");
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    const shouldDelete = window.confirm("Delete this category?");

    if (!shouldDelete) return;

    try {
      await removeDB(`categories/${categoryId}`);

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId),
      );

      toast("Category deleted.", "danger");
    } catch (error) {
      toast("Could not delete category.", "danger");
    }
  };

  // Count listings belonging to a category
  const getListingCount = (categoryName) => {
    return listings.filter((listing) => listing.category === categoryName)
      .length;
  };

  return (
    <>
      <div className="section-head">
        <h2>Categories</h2>

        <button
          className="btn-primary-tn"
          onClick={() => openCategoryPopup(null)}
        >
          <i className="fa-solid fa-plus me-2" />
          New Category
        </button>
      </div>

      <div className="panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>Name</th>
                <th>Listings</th>
                <th style={{ width: 200 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="muted center">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <td className="muted">{index + 1}</td>

                    <td>
                      <strong>{category.name}</strong>
                    </td>

                    <td>{getListingCount(category.name)}</td>

                    <td>
                      <div className="btn-row">
                        <button
                          className="btn-mini edit"
                          onClick={() => openCategoryPopup(category)}
                        >
                          <i className="fa-solid fa-pen me-1" />
                          Edit
                        </button>

                        <button
                          className="btn-mini delete"
                          onClick={() => deleteCategory(category.id)}
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
        title={editingCategoryId ? "Edit Category" : "New Category"}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setIsPopupOpen(false)}>
              Cancel
            </button>

            <button className="btn-primary-tn" onClick={saveCategory}>
              Save
            </button>
          </>
        }
      >
        <InputField
          label="Category Name"
          icon="fa-tag"
          value={categoryName}
          onChange={setCategoryName}
          placeholder="e.g. Villa, Houseboat"
          required
          autoFocus
        />
      </Popup>
    </>
  );
};

export default ManageCategories;
