import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const CityView = () => {
  const [city, setCity] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [reload, setReload] = useState(false);
  const [countries, setCountries] = useState([]);

  const { cityId } = useParams();
  const countryRef = useRef(null);

  useEffect(() => {
    fetchCity();
  }, [reload]);

  const fetchCity = async () => {
    try {
      const response = await axios.get(`/city/${cityId}`);
      setCity(response.data);
      setNewName(response.data.city);
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  const handleCityUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("country id : ", countryRef.current.value);
      await axios.put(`/city/${cityId}`, {
        city: newName,
        country_id: countryRef.current.value,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating city:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `/country/search?query=${city.country.country}`
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleCountrySearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/country/search?query=${inputValue.target.value}`
      );
      console.log("countries:", response.data);
      setCountries(response.data);
    } catch (error) {
      console.error("Error searching countries:", error);
      return [];
    }
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
    fetchCountries();
  };

  return (
    <div>
      {city ? (
        <div>
          {editMode ? (
            <form onSubmit={handleCityUpdate}>
              <DebounceInput
                type="text"
                placeholder="Search..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleCountrySearch} // Handle input change event
              />
              <select ref={countryRef}>
                {countries.map((country) => (
                  <option key={country.country_id} value={country.country_id}>
                    {country.country}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder={city.city}
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
              <h2>{`${city.city}, ${city.country.country}`}</h2>
              <button onClick={handleEditButtonClick}>Edit</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CityView;
