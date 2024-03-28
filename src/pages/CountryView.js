import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

const CountryView = (/*{ countryId , onUpdate }*/) => {
  const [country, setCountry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [reload, setReload] = useState(false);

  const { countryId } = useParams();

  useEffect(() => {
    fetchCountry();
  }, [reload]);

  const fetchCountry = async () => {
    try {
      const response = await axios.get(`/country/${countryId}`);
      setCountry(response.data);
      //setNewName(response.data.country);
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/country/${countryId}`, { country: newName });
      setEditMode(false);
      setReload(!reload);
      //if (onUpdate) onUpdate(); // Notify parent component that country has been updated
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  return (
    <div>
      {country ? (
        <div>
          {editMode ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder={country.country}
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
              <h2>{country.country}</h2>
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

export default CountryView;
