import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const LanguageView = () => {
  const [language, setLanguage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [reload, setReload] = useState(false);

  const { languageId } = useParams();

  useEffect(() => {
    fetchLanguage();
  }, [reload]);

  const fetchLanguage = async () => {
    try {
      const response = await axios.get(`/language/${languageId}`);
      setLanguage(response.data);
      setNewName(response.data.name);
    } catch (error) {
      console.error("Error fetching language:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/language/${languageId}`, { name: newName });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return (
    <div>
      {language ? (
        <div>
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder={language.language}
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
              <h2>{language.name}</h2>
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

export default LanguageView;
