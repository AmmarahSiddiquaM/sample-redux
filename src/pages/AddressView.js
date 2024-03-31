import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";

const AddressView = () => {
  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newAddress, setNewAddress] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newPostalcode, setNewPostalcode] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [reload, setReload] = useState(false);
  const [cities, setCities] = useState([]);

  const { addressId } = useParams();
  const cityRef = useRef(null);

  useEffect(() => {
    fetchAddress();
  }, [reload]);

  const fetchAddress = async () => {
    try {
      const response = await axios.get(`/address/${addressId}`);
      setAddress(response.data);
      setNewAddress(response.data.address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log("city id : ", cityRef.current.value);
      await axios.put(`/address/${addressId}`, {
        address: newAddress,
        city_id: cityRef.current.value,
        address2: newAddressLine2,
        district: newDistrict,
        postal_code: newPostalcode,
        phone: newPhone,
      });
      setEditMode(false);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        `/city/search?query=${address.city.city}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCitySearch = async (inputValue) => {
    try {
      const response = await axios.get(
        `/city/search?query=${inputValue.target.value}`
      );
      console.log("cities:", response.data);
      setCities(response.data);
    } catch (error) {
      console.error("Error searching cities:", error);
      return [];
    }
  };

  const handleEditButtonClick = () => {
    setEditMode(true);
    fetchCities();
  };

  return (
    <div>
      {address ? (
        <div>
          {editMode ? (
            <form onSubmit={handleAddressUpdate}>
              <DebounceInput
                type="text"
                placeholder="Search..."
                minLength={2} // Minimum number of characters before debounce triggers
                debounceTimeout={300} // Debounce timeout in milliseconds
                onChange={handleCitySearch} // Handle input change event
              />
              <select ref={cityRef}>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder={address.address}
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />

              <input
                type="text"
                value={newAddressLine2}
                onChange={(e) => setNewAddressLine2(e.target.value)}
                placeholder={address.address2}
              />
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                placeholder={address.district}
              />
              <input
                type="text"
                value={newPostalcode}
                onChange={(e) => setNewPostalcode(e.target.value)}
                placeholder={address.postal_code}
              />
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder={address.phone}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{`${address.address}`}</h2>
              <h2>{`${address.address2}`}</h2>
              <h2>{`${address.district}, ${address.city.city}`}</h2>
              <h2>{`${address.postal_code}`}</h2>
              <h2>{`${address.phone}`}</h2>

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

export default AddressView;
