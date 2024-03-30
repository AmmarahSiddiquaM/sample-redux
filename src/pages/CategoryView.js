import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const CategoryView = () => {
  const [category, setCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [reload, setReload] = useState(false);

  const { categoryId } = useParams();

  useEffect(() => {
    fetchCategory();
  }, [reload]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/category/${categoryId}`);
      setCategory(response.data);
      setNewName(response.data.name);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/category/${categoryId}`, { name: newName });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div>
      {category ? (
        <div>
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder={category.category}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{category.name}</h2>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryView;
