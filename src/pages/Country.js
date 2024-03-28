import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCountries();
  }, [currentPage]); // Refetch countries when currentPage changes

  const navigate = useNavigate();
  const newCountryNameRef = useRef(null);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`/country?page=${currentPage}`);
      setCountries(response.data.countries);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleCreateCountry = async () => {
    try {
      await axios.post("/country", { country: newCountryName });
      setNewCountryName("");
      setShowCreateForm(false);
      setCurrentPage(1); // Reset to first page after creating a new country
    } catch (error) {
      console.error("Error creating country:", error);
    }
  };

  const handleDeleteCountry = async (countryId) => {
    try {
      await axios.delete(`/country/${countryId}`);
      //fetchCountries(); // Refresh country list
      setCurrentPage(1); // Reset to first page after deleting a  country
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  const handleUpdateCountry = async () => {
    try {
      await axios.put(`/country/${selectedCountryId}`, {
        country: newCountryNameRef.current.value,
      });
      setSelectedCountryId(null);
      fetchCountries(); // Refresh country list
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const handleNavigateCountry = (id) => {
    navigate(`./country/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {!showCreateForm ? (
        <>
          <h1>Country Page</h1>
          <h2>Countries</h2>

          <ul>
            {countries.map((country) => (
              <li key={country.country_id}>
                {selectedCountryId === country.country_id ? (
                  <>
                    <input
                      type="text"
                      ref={newCountryNameRef}
                      placeholder={country.country}
                    />
                    <button
                      onClick={() => {
                        handleUpdateCountry();
                      }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <>
                    {country.country}{" "}
                    <button
                      onClick={() => handleNavigateCountry(country.country_id)}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteCountry(country.country_id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedCountryId(country.country_id)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>

          <button onClick={() => setShowCreateForm(true)}>
            Create New Country
          </button>
        </>
      ) : (
        <>
          <h2>Create Country</h2>
          <input
            type="text"
            value={newCountryName}
            onChange={(e) => setNewCountryName(e.target.value)}
            placeholder="Enter country name"
          />
          <button onClick={handleCreateCountry}>Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default Country;
